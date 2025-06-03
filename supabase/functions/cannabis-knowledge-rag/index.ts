import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Pinecone } from 'npm:@pinecone-database/pinecone@2.2.0';
import OpenAI from 'npm:openai@4.47.1';

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

    // Parse request data
    const { query }: { query: string } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Missing query parameter' }),
        { headers, status: 400 }
      );
    }

    // 1. Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Query Pinecone for relevant context
    const index = pinecone.Index(PINECONE_INDEX_NAME);
    const queryResult = await index.query({
      vector: queryEmbedding,
      topK: 3, // Retrieve top 3 most relevant results
      includeMetadata: true,
    });

    let context = '';
    if (queryResult.matches && queryResult.matches.length > 0) {
      context = queryResult.matches
        .map(match => (match.metadata as { text: string })?.text)
        .filter(Boolean)
        .join('\n\n');
    }

    // 3. Construct prompt for LLM
    const systemPrompt = `You are Bud, an expert cannabis assistant. Answer the user's question based on the provided context. If the answer is not in the context, state that you don't have enough information but try to provide helpful general information about the topic. Be friendly, helpful, and easy to understand. Avoid using overly technical language unless specifically asked for details. Your tone should be conversational and approachable, like a knowledgeable friend.`;
    
    const userPrompt = `Question: ${query}\n\nContext:\n${context || "No specific context available for this question."}\n\nAnswer:`;

    // 4. Call LLM to generate response
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini', // Changed from 'gpt-4o-mini' to 'gpt-4.1-mini'
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const botResponse = chatCompletion.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        answer: botResponse, 
        context_used: context ? true : false 
      }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error('Error in cannabis-knowledge-rag function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
};

Deno.serve(handler);