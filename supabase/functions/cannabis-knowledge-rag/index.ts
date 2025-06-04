import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Pinecone } from 'npm:@pinecone-database/pinecone@2.2.0';
import OpenAI from 'npm:openai@4.47.1';

// Initialize OpenAI client
const openaiKey = Deno.env.get('OPENAI_API_KEY');
const pineconeKey = Deno.env.get('PINECONE_API_KEY');
const pineconeEnv = Deno.env.get('PINECONE_ENVIRONMENT') || 'us-east-1';

// Only initialize clients if keys are available
const openai = openaiKey ? new OpenAI({
  apiKey: openaiKey,
}) : null;

// Initialize Pinecone client only if API key is available
const pinecone = pineconeKey ? new Pinecone({
  apiKey: pineconeKey,
  environment: pineconeEnv,
}) : null;

const PINECONE_INDEX_NAME = Deno.env.get('PINECONE_INDEX_NAME') || 'leafiq-prompts';

const EMBEDDING_MODEL = 'text-embedding-3-small'; // Using OpenAI's embedding model

// Fallback responses for when API keys are missing or services are unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  'terpene': 'Terpenes are aromatic compounds found in cannabis and many other plants. They contribute to the aroma, flavor, and effects of cannabis. Common terpenes include myrcene (relaxing), limonene (uplifting), pinene (focusing), and caryophyllene (pain relief).',
  'thc': 'THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the "high" sensation. It works by binding to cannabinoid receptors in the brain.',
  'cbd': 'CBD (cannabidiol) is a non-intoxicating compound found in cannabis. It\'s often used for its potential therapeutic effects, including relief from pain, anxiety, and inflammation, without producing a "high."',
  'indica': 'Indica strains are typically associated with relaxing, sedating effects that are great for evening use and sleep. They often have higher levels of myrcene and linalool terpenes.',
  'sativa': 'Sativa strains are typically associated with energizing, uplifting effects that are good for daytime use. They often have higher levels of limonene and pinene terpenes.',
  'hybrid': 'Hybrid strains are a mix of indica and sativa genetics, offering balanced effects. The specific effects depend on the parent strains and their terpene profiles.',
  'entourage': 'The entourage effect is the theory that all compounds in cannabis work together synergistically to produce effects that isolated compounds cannot. This includes cannabinoids, terpenes, and flavonoids working together.',
  'edible': 'Edibles are cannabis-infused food products. They take longer to take effect (30-90 minutes) but provide longer-lasting effects (4-8 hours). Start with a low dose (2.5-5mg THC) and wait before consuming more.',
  'microdosing': 'Microdosing cannabis involves taking very small amounts (1-2.5mg THC) to achieve subtle effects without feeling "high." It\'s popular for those seeking therapeutic benefits while remaining functional.',
};

// CORS headers to be used consistently throughout the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Helper function to get fallback response
const getFallbackResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Find matching fallback responses
  const matchingKeywords = Object.keys(FALLBACK_RESPONSES).filter(keyword => 
    lowerQuery.includes(keyword.toLowerCase())
  );
  
  if (matchingKeywords.length > 0) {
    // Use the longest matching keyword for the most specific response
    const bestMatch = matchingKeywords.sort((a, b) => b.length - a.length)[0];
    return "I'm providing this answer from my basic knowledge. " + FALLBACK_RESPONSES[bestMatch];
  } 
  
  return "I'm sorry, I don't have specific information about that in my knowledge base. Cannabis has many cannabinoids and terpenes that work together to create different effects. If you have questions about specific strains, consumption methods, or effects, feel free to ask more specifically.";
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // Parse request data
    let query: string;
    try {
      const data = await req.json();
      query = data.query;
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          answer: "I couldn't understand your question. Please try again."
        }),
        { headers: corsHeaders, status: 400 }
      );
    }

    if (!query) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing query parameter',
          answer: "I need a question to answer. Please try again with a specific question."
        }),
        { headers: corsHeaders, status: 400 }
      );
    }
    
    // Check if required API keys are available
    if (!openaiKey || !pineconeKey || !openai || !pinecone) {
      console.log('API keys missing, using fallback responses');
      
      // Use fallback responses when API keys are missing
      const fallbackResponse = getFallbackResponse(query);
      
      return new Response(
        JSON.stringify({ 
          answer: fallbackResponse, 
          context_used: false,
          fallback: true
        }),
        { headers: corsHeaders, status: 200 }
      );
    }

    try {
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
        { headers: corsHeaders, status: 200 }
      );
    } catch (serviceError) {
      console.error('Error calling AI services:', serviceError);
      
      // Fallback to predefined responses
      const fallbackResponse = getFallbackResponse(query);
      
      return new Response(
        JSON.stringify({ 
          answer: fallbackResponse, 
          context_used: false,
          fallback: true,
          error: serviceError.message
        }),
        { headers: corsHeaders, status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in cannabis-knowledge-rag function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        answer: "I'm sorry, I encountered an error while processing your question. Please try again later."
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
};

Deno.serve(handler);