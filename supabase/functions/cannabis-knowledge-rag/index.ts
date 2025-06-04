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
}) : null;

const PINECONE_INDEX_NAME = Deno.env.get('PINECONE_INDEX_NAME') || 'budbudtender';

const EMBEDDING_MODEL = 'text-embedding-3-small'; // Using OpenAI's embedding model

// Fallback responses for when API keys are missing or services are unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  'dose': 'Hey there! For dosing, especially with edibles, I always say "start low and go slow." Begin with 2.5-5mg of THC if you\'re new to cannabis, or even 1-2.5mg if you\'re really cautious. Edibles can take 30-90 minutes to kick in and last 4-8 hours, so be patient! Wait at least 2 hours before taking more. Everyone\'s body processes cannabis differently, so what works for your friend might be different for you.',
  'edible': 'Edibles are one of my favorite ways to enjoy cannabis! They\'re cannabis-infused food products that give you longer-lasting effects than smoking or vaping. Here\'s the thing though - they take 30-90 minutes to work because they have to go through your digestive system first. But once they kick in, you\'re looking at 4-8 hours of effects. Start with 2.5-5mg THC and wait before taking more. Trust me on this one!',
  'terpene': 'Ah, terpenes! These are the aromatic compounds that give cannabis (and lots of other plants) their unique smells and flavors. But they do so much more than that - they actually influence how cannabis affects you! Myrcene is great for relaxation, limonene lifts your mood, pinene helps with focus, and caryophyllene can help with pain. It\'s like nature\'s way of creating different experiences in each strain.',
  'thc': 'THC is the star of the show when it comes to that classic cannabis \"high\" feeling. It\'s what makes you feel euphoric, relaxed, or sometimes giggly. THC works by binding to receptors in your brain and nervous system. The key is finding the right amount for you - too little and you might not feel much, too much and you might feel overwhelmed.',
  'cbd': 'CBD is like THC\'s chill cousin - it won\'t get you high, but it has some amazing potential benefits! People use it for pain relief, anxiety, inflammation, and better sleep. What\'s cool is that CBD can actually balance out THC\'s effects if you take too much. That\'s why many people love products with both CBD and THC together.',
  'indica': 'Indica strains are perfect for when you want to unwind! They\'re known for those relaxing, \"couch-lock\" effects that make them great for evening use or when you want to get a good night\'s sleep. They typically have terpenes like myrcene and linalool that enhance that chill, sedating feeling.',
  'sativa': 'Sativa strains are your daytime companion! They\'re energizing and uplifting, perfect for creative projects, social situations, or when you need to stay productive. Look for terpenes like limonene and pinene in sativas - they help with that focused, motivated feeling.',
  'hybrid': 'Hybrids are the best of both worlds! They combine indica and sativa genetics to give you balanced effects. Some lean more energizing, others more relaxing, depending on their parent strains and terpene profiles. It\'s like having a custom-tailored experience.',
  'microdosing': 'Microdosing is brilliant for people who want the benefits without feeling \"high.\" We\'re talking tiny amounts - 1-2.5mg of THC. It\'s perfect for staying functional while getting some relief from stress, pain, or anxiety. Many people find it helps with creativity and focus too!'
};

/**
 * Determine if a question should trigger inventory RAG lookup
 * This analyzes the user's question to see if product information would be helpful
 * Updated to be more selective - only show products for direct requests or application questions
 */
function shouldUseInventoryRAG(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Educational questions that should NOT show products
  const educationalPhrases = [
    'what is', 'what are', 'explain', 'definition of', 'define', 'tell me about',
    'how does', 'why does', 'difference between', 'help me understand',
    'what\'s the', 'whats the', 'learn about', 'educate me'
  ];
  
  // Check if it's a pure educational question
  const isEducational = educationalPhrases.some(phrase => lowerQuery.includes(phrase));
  
  // If it's educational AND doesn't have application context, don't show products
  if (isEducational) {
    const hasApplicationContext = lowerQuery.includes('help with') || 
                                lowerQuery.includes('good for') ||
                                lowerQuery.includes('best for') ||
                                lowerQuery.includes('recommend') ||
                                lowerQuery.includes('which products');
    
    return hasApplicationContext;
  }
  
  // Direct product requests (always show products)
  const productKeywords = [
    'recommend', 'suggestion', 'products', 'strains', 'gummies', 'edibles', 'vapes', 'flower',
    'best', 'good for', 'help with', 'options', 'available', 'stock', 'inventory', 'have',
    'strongest', 'highest', 'lowest', 'cheapest', 'most potent'
  ];
  
  const hasProductKeywords = productKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Application/effect questions (show products)
  const applicationKeywords = [
    'sleep', 'anxiety', 'pain', 'stress', 'energy', 'focus', 'creative', 'social',
    'relaxation', 'appetite', 'nausea', 'depression', 'mood', 'motivation'
  ];
  
  const hasApplicationKeywords = applicationKeywords.some(keyword => lowerQuery.includes(keyword));
  
  return hasProductKeywords || hasApplicationKeywords;
}

// CORS headers to be used consistently throughout the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug',
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
    return "I'm sorry, I couldn't connect to the knowledge base at the moment. " + FALLBACK_RESPONSES[bestMatch];
  } 
  
  return "I'm sorry, I couldn't connect to the knowledge base at the moment. But I'm here to help with any cannabis questions you have! Whether it's about strains, effects, consumption methods, or dosing - feel free to ask me anything specific and I'll do my best to guide you safely and responsibly.";
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
        // Log what we're retrieving for debugging
        console.log('Query:', query);
        console.log('Retrieved matches:', queryResult.matches.length);
        queryResult.matches.forEach((match, idx) => {
          const text = (match.metadata as { text: string })?.text;
          console.log(`Match ${idx + 1} (score: ${match.score}):`, text?.substring(0, 100) + '...');
        });
        
        context = queryResult.matches
          .map(match => (match.metadata as { text: string })?.text)
          .filter(Boolean)
          .join('\n\n');
      }

      // 3. Construct prompt for LLM
      const systemPrompt = `You are Bud Buddy, a friendly and knowledgeable cannabis expert who works as a budtender assistant. You have a warm, approachable personality and love helping people learn about cannabis in a way that's easy to understand. You're like a knowledgeable friend who always looks out for people's wellbeing.

Your personality traits:
- Friendly and conversational, never clinical or overly formal
- Safety-conscious - you always emphasize "start low and go slow" 
- Educational but not preachy - you love sharing knowledge in bite-sized, digestible pieces
- Encouraging and supportive of people exploring cannabis responsibly
- You use phrases like "Hey there!", "Trust me on this one!", "Here's the thing though", and "That's awesome!"

IMPORTANT GUIDELINES FOR PRODUCT RECOMMENDATIONS:

1. **Direct Product Questions**: When someone asks "What gummies do you have?", "Show me your edibles", "What products do you carry?", etc., you should:
   - Acknowledge their specific request
   - Provide brief relevant information about that product type
   - DO NOT say "I don't have exact inventory" - you DO have access to current inventory
   - End with something like "Let me show you what we have in stock:" or "Here are our current options:"

2. **Educational Questions**: When someone asks "What are terpenes?", "What is THC?", "Explain the endocannabinoid system", etc., provide ONLY educational information. Do NOT mention products or suggest looking at inventory.

3. **Application Questions**: When someone asks "What indica strains help with sleep?", "Recommend something for anxiety", "Which products have good terpenes?", etc., provide educational information AND conclude with product suggestions if available.

RESPONSE STRUCTURE:
- Answer the SPECIFIC question asked
- For direct product requests, acknowledge you'll show current inventory
- If it's purely educational, stop after the explanation
- If it involves product selection/recommendations, conclude with: "Here are some of our [relevant type] options:" or similar
- Always prioritize safety and responsible use
- Keep responses conversational and easy to understand

The system will automatically add actual product information from our current inventory when appropriate - your job is to provide the educational content and properly introduce product recommendations when asked.`;
      
      const userPrompt = `User's Question: ${query}

Context from Knowledge Base:
${context || "No specific context available for this question."}

Instructions: Answer the user's SPECIFIC question above. If they asked about the endocannabinoid system, explain what it is. If they asked about dosing, explain dosing. If they asked for product recommendations or mentioned wanting to try something, provide educational context and then indicate that product recommendations would be helpful. Do NOT give generic "getting started" advice unless that's what they asked for. Use the context provided to give an accurate, helpful answer to their actual question.

Answer:`;

      // 4. Call LLM to generate response
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano-2025-04-14', // Updated to correct model name
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const botResponse = chatCompletion.choices[0].message.content;
      
      // Check if products should be recommended based on the query
      const shouldRecommendProducts = shouldUseInventoryRAG(query);

      // Include debug info if requested
      const debugInfo = req.headers.get('X-Debug') === 'true' ? {
        retrieved_context: context,
        match_scores: queryResult.matches?.map(m => ({ 
          score: m.score, 
          id: m.id,
          preview: (m.metadata as { text: string })?.text?.substring(0, 100) 
        }))
      } : {};
      
      return new Response(
        JSON.stringify({ 
          answer: botResponse, 
          context_used: context ? true : false,
          should_recommend_products: shouldRecommendProducts,
          ...debugInfo
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