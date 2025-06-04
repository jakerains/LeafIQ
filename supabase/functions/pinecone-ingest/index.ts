import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Pinecone, RecordMetadata } from 'npm:@pinecone-database/pinecone@2.2.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// Initialize Pinecone client
const pineconeApiKey = Deno.env.get('PINECONE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

if (!pineconeApiKey) {
  console.error('Missing PINECONE_API_KEY environment variable');
}
if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL environment variable');
}
if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}
if (!openaiApiKey) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

const pinecone = new Pinecone({
  apiKey: pineconeApiKey!,
});

// Updated index configuration for budbudtender
const PINECONE_INDEX_NAME = 'budbudtender';
const PINECONE_HOST = 'https://budbudtender-pebqwjs.svc.aped-4627-b74a.pinecone.io';

// Using OpenAI's text-embedding-3-small model (1536 dimensions)
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

// Initialize Supabase client
const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey!
);

interface DocumentData {
  id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
  fileType?: string; // Track original file type for processing
  // Enhanced metadata fields
  difficulty?: string;
  subcategory?: string;
  topics?: string;
  query_type?: string;
  complexity?: string;
  prompt_id?: string;
  category_id?: string;
  priority_level?: string;
  target_users?: string;
  retrieval_tags?: string;
  document_type?: string;
  version?: string;
  target_audience?: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
      'Access-Control-Max-Age': '3600',
      'Content-Type': 'application/json',
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers, status: 200 });
    }

          // Check for required environment variables
      if (!pineconeApiKey || !supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
        const missing = [];
        if (!pineconeApiKey) missing.push('PINECONE_API_KEY');
        if (!supabaseUrl) missing.push('SUPABASE_URL');
        if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
        if (!openaiApiKey) missing.push('OPENAI_API_KEY');
      
      return new Response(
        JSON.stringify({ 
          error: 'Missing required environment variables', 
          missing: missing 
        }),
        { headers, status: 500 }
      );
    }

    // Verify authorization using Supabase auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers, status: 401 }
      );
    }

    // Get token from Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { headers, status: 401 }
      );
    }

    // Check if user is a super_admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
      
    if (profileError || profile.role !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only super admins can ingest documents' }),
        { headers, status: 403 }
      );
    }

    // Parse request data
    const { documents, operation = 'upsert' }: { 
      documents: DocumentData[];
      operation?: 'upsert' | 'delete';
    } = await req.json();

    // Validate request data
    if (!Array.isArray(documents) || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: documents array is required' }),
        { headers, status: 400 }
      );
    }

    if (operation === 'delete') {
      // Handle delete operation
      const documentIds = documents.map(doc => doc.id).filter(Boolean);
      if (documentIds.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: document IDs are required for delete operation' }),
          { headers, status: 400 }
        );
      }

      // Delete from Pinecone
      const index = pinecone.Index(PINECONE_INDEX_NAME);
      await index.deleteMany(documentIds);

      // Update status in database
      const { error: deleteError } = await supabase
        .from('pinecone_documents')
        .update({ status: 'deleted', ingested_at: new Date().toISOString() })
        .in('id', documentIds);

      if (deleteError) {
        console.error('Database update error:', deleteError);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          operation: 'delete',
          count: documentIds.length
        }),
        { headers, status: 200 }
      );
    } else {
      // Handle upsert operation
      let allDocuments: DocumentData[] = [];
      
      // Enhanced: Process documents, checking if any are structured knowledge bases
      for (const doc of documents) {
        if (doc.fileType === 'json' && doc.content) {
          try {
            const jsonData = JSON.parse(doc.content);
            if (isStructuredKnowledgeBase(jsonData)) {
              // Parse structured knowledge base into multiple documents
              const parsed = parseStructuredKnowledgeBase(jsonData);
              allDocuments.push(...parsed.documents);
              console.log(`Enhanced parsing: Converted ${doc.title} into ${parsed.documents.length} individual documents`);
            } else {
              // Regular document
              allDocuments.push(doc);
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            // Treat as regular document if parsing fails
            allDocuments.push(doc);
          }
        } else {
          // Regular document (not JSON or failed parsing)
          allDocuments.push(doc);
        }
      }
      
      console.log(`Processing ${allDocuments.length} total documents (original: ${documents.length})`);
      
      // Process each document
      const results = await Promise.all(
        allDocuments.map(async (doc) => {
          try {
            // Get the Pinecone index
            const index = pinecone.Index(PINECONE_INDEX_NAME);

            // Create a unique ID if not provided
            const docId = doc.id || crypto.randomUUID();

            // Generate embedding using OpenAI
            const embedding = await generateEmbedding(doc.content);

            // Create vector record for standard Pinecone upsert
            const vectorRecord = {
              id: docId,
              values: embedding, // OpenAI generated embedding vector
              metadata: {
                // All fields become metadata
              title: doc.title,
                text: doc.content, // Store original text in metadata for reference
                source: doc.source || 'superadmin-upload',
                category: doc.category || 'general',
                fileType: doc.fileType || 'text',
                // Add enhanced metadata if available
                ...(doc.difficulty && { difficulty: doc.difficulty }),
                ...(doc.subcategory && { subcategory: doc.subcategory }),
                ...(doc.topics && { topics: doc.topics }),
                ...(doc.query_type && { query_type: doc.query_type }),
                ...(doc.complexity && { complexity: doc.complexity }),
                ...(doc.prompt_id && { prompt_id: doc.prompt_id }),
                ...(doc.category_id && { category_id: doc.category_id }),
                ...(doc.priority_level && { priority_level: doc.priority_level }),
                ...(doc.target_users && { target_users: doc.target_users }),
                ...(doc.retrieval_tags && { retrieval_tags: doc.retrieval_tags }),
                ...(doc.document_type && { document_type: doc.document_type }),
                ...(doc.version && { version: doc.version }),
                ...(doc.target_audience && { target_audience: doc.target_audience }),
                ...(doc.language && { language: doc.language })
              }
            };

            // Upsert to Pinecone using standard vector format
            await index.upsert([vectorRecord]);

            // Store document in database with enhanced metadata
            // Use a proper UUID for the database
            const dbId = crypto.randomUUID();
            const { error: dbError } = await supabase
              .from('pinecone_documents')
              .upsert({
                id: dbId,
                pinecone_id: docId, // Store the Pinecone ID for reference
                title: doc.title,
                content: doc.content,
                source: doc.source || 'superadmin-upload',
                category: doc.category || 'general',
                file_type: doc.fileType || 'text',
                created_by: user.id,
                ingested_at: new Date().toISOString(),
                status: 'ingested'
              });

            if (dbError) {
              console.error('Database error:', dbError);
              return { id: docId, success: false, error: dbError.message };
            }

            return { id: docId, success: true };
          } catch (error) {
            console.error('Error processing document:', error);
            return { id: doc.id, success: false, error: error.message };
          }
        })
      );

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      return new Response(
        JSON.stringify({ 
          success: failCount === 0,
          operation: 'upsert',
          results: {
            total: results.length,
            successful: successCount,
            failed: failCount,
            details: results,
            // Enhanced: Include parsing info
            originalDocuments: documents.length,
            expandedDocuments: allDocuments.length
          }
        }),
        { headers, status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in pinecone-ingest function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
};

// Parse file content based on file type
function parseFileContent(content: string, fileType: string): { title?: string; content: string; documents?: DocumentData[] } {
  try {
    switch (fileType.toLowerCase()) {
      case 'json':
        const jsonData = JSON.parse(content);
        
        // Enhanced: Detect structured knowledge base format
        if (isStructuredKnowledgeBase(jsonData)) {
          return parseStructuredKnowledgeBase(jsonData);
        }
        
        // Original logic for other JSON formats
        if (Array.isArray(jsonData)) {
          // Handle array of documents
          return {
            content: jsonData.map(item => 
              typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
            ).join('\n\n')
          };
        } else if (typeof jsonData === 'object') {
          // Handle single object
          return {
            title: jsonData.title || jsonData.name || undefined,
            content: JSON.stringify(jsonData, null, 2)
          };
        }
        return { content };
        
      case 'md':
      case 'markdown':
        // Extract title from first h1 heading if present
        const mdLines = content.split('\n');
        const h1Match = mdLines.find(line => line.startsWith('# '));
        const mdTitle = h1Match ? h1Match.replace('# ', '').trim() : undefined;
        return { title: mdTitle, content };
        
      case 'txt':
      case 'text':
      default:
        // Extract title from first line if it looks like a title
        const textLines = content.split('\n');
        const firstLine = textLines[0]?.trim();
        const textTitle = (firstLine && firstLine.length < 100 && !firstLine.includes('.')) ? firstLine : undefined;
        return { title: textTitle, content };
    }
  } catch (error) {
    console.error('Error parsing file content:', error);
    return { content };
  }
}

// Enhanced: Detect if JSON file is a structured knowledge base
function isStructuredKnowledgeBase(jsonData: any): boolean {
  return (
    typeof jsonData === 'object' && 
    jsonData !== null &&
    jsonData.metadata &&
    jsonData.entries &&
    Array.isArray(jsonData.entries) &&
    jsonData.entries.length > 0 &&
    jsonData.entries[0].prompt &&
    jsonData.entries[0].response
  );
}

// Enhanced: Parse structured knowledge base into individual documents
function parseStructuredKnowledgeBase(jsonData: any): { content: string; documents: DocumentData[] } {
  const documents: DocumentData[] = [];
  
  // Extract file-level metadata
  const fileMetadata = jsonData.metadata || {};
  const categoryInfo = jsonData.category_info || {};
  
  // Process each entry as a separate document
  jsonData.entries.forEach((entry: any, index: number) => {
    try {
      // Create unique document ID
      const docId = entry.prompt_id || `${categoryInfo.category_id || 'entry'}_${index + 1}`;
      
      // Create optimized content for retrieval
      const content = createOptimizedContent(entry, categoryInfo, fileMetadata);
      
      // Create comprehensive title
      const title = createDocumentTitle(entry, categoryInfo, index + 1);
      
      // Combine all metadata levels
      const combinedMetadata = createCombinedMetadata(entry, categoryInfo, fileMetadata);
      
      documents.push({
        id: docId,
        title: title,
        content: content,
        source: `knowledge_base_${categoryInfo.category_id || 'unknown'}`,
        category: categoryInfo.category_name || entry.metadata?.category || 'general',
        fileType: 'structured_knowledge_json',
        // Add custom fields for enhanced metadata
        ...combinedMetadata
      });
    } catch (error) {
      console.error(`Error processing entry ${index}:`, error);
      // Continue processing other entries
    }
  });
  
  // Create summary content for the overall file (fallback)
  const summaryContent = `Knowledge Base: ${categoryInfo.category_name || 'Unknown Category'}\n` +
    `Entries: ${documents.length}\n` +
    `Document Type: ${fileMetadata.document_type || 'Unknown'}\n` +
    `Target Audience: ${fileMetadata.target_audience || 'Unknown'}`;
  
  return { content: summaryContent, documents };
}

// Enhanced: Create optimized content for better retrieval
function createOptimizedContent(entry: any, categoryInfo: any, fileMetadata: any): string {
  const sections = [];
  
  // Add question/prompt prominently
  sections.push(`QUESTION: ${entry.prompt}`);
  sections.push(''); // Empty line for readability
  
  // Add comprehensive answer
  sections.push(`ANSWER: ${entry.response}`);
  sections.push(''); // Empty line
  
  // Add context information for better matching
  if (entry.query_type) {
    sections.push(`QUERY TYPE: ${entry.query_type}`);
  }
  
  if (entry.complexity) {
    sections.push(`DIFFICULTY: ${entry.complexity}`);
  }
  
  // Add category context
  if (categoryInfo.category_name) {
    sections.push(`CATEGORY: ${categoryInfo.category_name}`);
  }
  
  if (categoryInfo.target_users) {
    sections.push(`TARGET USERS: ${categoryInfo.target_users}`);
  }
  
  // Add topics for better keyword matching
  if (entry.metadata?.topics && Array.isArray(entry.metadata.topics)) {
    sections.push(`TOPICS: ${entry.metadata.topics.join(', ')}`);
  }
  
  // Add subcategory for additional context
  if (entry.metadata?.subcategory) {
    sections.push(`SUBCATEGORY: ${entry.metadata.subcategory}`);
  }
  
  return sections.join('\n');
}

// Enhanced: Create meaningful document titles
function createDocumentTitle(entry: any, categoryInfo: any, entryNumber: number): string {
  // Use the prompt as the primary title (truncated if too long)
  let title = entry.prompt;
  
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  // Add category prefix if available
  if (categoryInfo.category_name) {
    title = `[${categoryInfo.category_name}] ${title}`;
  }
  
  return title;
}

// Enhanced: Combine metadata from all levels
function createCombinedMetadata(entry: any, categoryInfo: any, fileMetadata: any): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  // Entry-level metadata
  if (entry.metadata) {
    if (entry.metadata.difficulty) metadata.difficulty = entry.metadata.difficulty;
    if (entry.metadata.subcategory) metadata.subcategory = entry.metadata.subcategory;
    if (entry.metadata.topics && Array.isArray(entry.metadata.topics)) {
      metadata.topics = entry.metadata.topics.join(','); // Store as comma-separated string for Pinecone
    }
  }
  
  // Query metadata
  if (entry.query_type) metadata.query_type = entry.query_type;
  if (entry.complexity) metadata.complexity = entry.complexity;
  if (entry.prompt_id) metadata.prompt_id = entry.prompt_id;
  
  // Category-level metadata
  if (categoryInfo.category_id) metadata.category_id = categoryInfo.category_id;
  if (categoryInfo.priority_level) metadata.priority_level = categoryInfo.priority_level;
  if (categoryInfo.target_users) metadata.target_users = categoryInfo.target_users;
  if (categoryInfo.retrieval_tags && Array.isArray(categoryInfo.retrieval_tags)) {
    metadata.retrieval_tags = categoryInfo.retrieval_tags.join(',');
  }
  
  // File-level metadata
  if (fileMetadata.document_type) metadata.document_type = fileMetadata.document_type;
  if (fileMetadata.version) metadata.version = fileMetadata.version;
  if (fileMetadata.target_audience) metadata.target_audience = fileMetadata.target_audience;
  if (fileMetadata.language) metadata.language = fileMetadata.language;
  
  return metadata;
}

// OpenAI API function to generate embeddings
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: EMBEDDING_MODEL,
    }),
    });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

Deno.serve(handler);