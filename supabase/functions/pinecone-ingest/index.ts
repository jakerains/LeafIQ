import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Pinecone, RecordMetadata } from 'npm:@pinecone-database/pinecone@2.2.0';
import OpenAI from 'npm:openai@4.47.1';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!,
});

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: Deno.env.get('PINECONE_API_KEY')!,
  environment: Deno.env.get('PINECONE_ENVIRONMENT') || 'us-east-1',
});

const PINECONE_INDEX_NAME = Deno.env.get('PINECONE_INDEX_NAME') || 'leafiq-prompts';

const EMBEDDING_MODEL = 'text-embedding-3-small'; // Using OpenAI's embedding model

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface DocumentData {
  id?: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
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
      // Process each document
      const results = await Promise.all(
        documents.map(async (doc) => {
          try {
            // Generate embedding
            const embedding = await generateEmbedding(doc.content);

            // Get the Pinecone index
            const index = pinecone.Index(PINECONE_INDEX_NAME);

            // Create a unique ID if not provided
            const docId = doc.id || crypto.randomUUID();

            // Prepare metadata
            const metadata: RecordMetadata & {
              text: string; // Required for the integrated embedding
              title: string;
              source?: string;
              category?: string;
            } = {
              text: doc.content, // Full text for search and retrieval
              title: doc.title,
              source: doc.source,
              category: doc.category
            };

            // Upsert to Pinecone
            await index.upsert([{
              id: docId,
              values: embedding,
              metadata
            }]);

            // Store document in database
            const { error: dbError } = await supabase
              .from('pinecone_documents')
              .upsert({
                id: docId,
                title: doc.title,
                content: doc.content,
                source: doc.source,
                category: doc.category,
                embedding: embedding,
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
            details: results
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

// Helper function to generate embeddings
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

Deno.serve(handler);