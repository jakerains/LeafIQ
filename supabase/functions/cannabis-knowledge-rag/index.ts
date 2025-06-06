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
 * More conversational approach - considers context and natural conversation flow
 */
function shouldUseInventoryRAG(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Direct product/shopping intent (always show products)
  const directProductRequests = [
    'show me', 'what do you have', 'what products', 'what strains', 'inventory',
    'what gummies', 'what edibles', 'what vapes', 'what flower', 'what concentrates',
    'browse', 'shop', 'buy', 'purchase', 'available', 'in stock', 'carry',
    'options', 'selection', 'varieties'
  ];
  
  if (directProductRequests.some(phrase => lowerQuery.includes(phrase))) {
    return true;
  }
  
  // Recommendation and "good for" questions (show products)
  const recommendationIndicators = [
    'recommend', 'suggestion', 'suggest', 'help me find', 'looking for',
    'need something', 'want something', 'best for', 'good for', 'what\'s good',
    'whats good', 'help with', 'work for', 'effective for'
  ];
  
  if (recommendationIndicators.some(phrase => lowerQuery.includes(phrase))) {
    return true;
  }
  
  // Effect/condition mentions (often lead to product discussions)
  const effectsAndConditions = [
    'sleep', 'anxiety', 'pain', 'stress', 'energy', 'focus', 'appetite',
    'nausea', 'depression', 'mood', 'inflammation', 'headache', 'migraine',
    'insomnia', 'relaxation', 'creative', 'social', 'concentration'
  ];
  
  // If they mention an effect/condition, they probably want to know about products
  if (effectsAndConditions.some(effect => lowerQuery.includes(effect))) {
    return true;
  }
  
  // Pure educational questions (no products)
  const pureEducationalPhrases = [
    'what is', 'what are', 'explain', 'definition of', 'define', 'tell me about',
    'how does', 'why does', 'difference between', 'help me understand',
    'learn about', 'educate me', 'how do', 'entourage effect', 
    'endocannabinoid', 'cannabinoid receptor'
  ];
  
  // Only return false for pure educational IF no effects are mentioned
  if (pureEducationalPhrases.some(phrase => lowerQuery.includes(phrase))) {
    // But still show products if they're asking about effects
    return effectsAndConditions.some(effect => lowerQuery.includes(effect));
  }
  
  // Default to showing products for conversational flow
  return true;
}

// CORS headers to be used consistently throughout the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-debug, x-stream',
  'Content-Type': 'application/json'
};

// Helper function to get fallback response
const getFallbackResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Check if the question is even cannabis-related
  const cannabisKeywords = ['cannabis', 'weed', 'marijuana', 'thc', 'cbd', 'strain', 'terpene', 'edible', 'vape', 'flower', 'indica', 'sativa', 'hybrid', 'dose', 'dosing', 'hemp', 'decarb', 'infusion', 'cannabutter', 'canna-oil'];
  const isCannabisTopic = cannabisKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Check for cannabis cooking/edibles context
  const cannabisCookingKeywords = ['cannabis cook', 'cannabis recipe', 'cannabis baking', 'edible recipe', 'cannabutter', 'canna-oil', 'cannabis infusion', 'decarboxylation', 'decarb', 'cannabis food', 'infused butter', 'infused oil', 'make edibles', 'cannabis chocolate', 'cannabis gummies'];
  const isCannabisCooking = cannabisCookingKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Check for obvious non-cannabis topics (but exclude cannabis cooking)
  const nonCannabisKeywords = ['code', 'coding', 'program', 'javascript', 'python', 'computer', 'software', 'algorithm', 'sport', 'politics', 'alcohol', 'beer', 'wine'];
  const isNonCannabisTopic = nonCannabisKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Check for general cooking (not cannabis-related)
  const isGeneralCooking = (lowerQuery.includes('recipe') || lowerQuery.includes('cook') || lowerQuery.includes('food') || lowerQuery.includes('baking')) && !isCannabisCooking;
  
  if (isNonCannabisTopic || isGeneralCooking || (!isCannabisTopic && !isCannabisCooking && (lowerQuery.includes('how to') || lowerQuery.includes('what is') || lowerQuery.includes('help me')))) {
    return "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?";
  }
  
  // Find matching fallback responses for cannabis topics
  const matchingKeywords = Object.keys(FALLBACK_RESPONSES).filter(keyword => 
    lowerQuery.includes(keyword.toLowerCase())
  );
  
  if (matchingKeywords.length > 0) {
    // Use the longest matching keyword for the most specific response
    const bestMatch = matchingKeywords.sort((a, b) => b.length - a.length)[0];
    return "I'm sorry, I couldn't connect to the knowledge base at the moment. " + FALLBACK_RESPONSES[bestMatch];
  } 
  
  return "I'm sorry, I couldn't connect to the knowledge base at the moment. But I'm here to help with any cannabis questions you have! Whether it's about cannabis strains, effects, consumption methods, or dosing - feel free to ask me anything cannabis-related and I'll do my best to guide you safely and responsibly.";
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    // Parse request data
    let query: string;
    let conversationContext: Array<{ role: string; content: string }> = [];
    try {
      const data = await req.json();
      query = data.query;
      conversationContext = data.conversationContext || [];
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
      const systemPrompt = `You are Bud Buddy, a friendly and knowledgeable cannabis expert who works as a budtender assistant. You're having a natural conversation with dispensary staff to help them learn and assist customers better.

IMPORTANT BOUNDARIES - YOU MUST FOLLOW THESE:
🚫 **CANNABIS-ONLY EXPERTISE**: You are ONLY knowledgeable about cannabis, cannabis products, cannabis cultivation, cannabis effects, cannabis science, cannabis regulations, cannabis cooking/edibles preparation, and cannabis industry topics. You have NO knowledge about anything else.

🚫 **STRICT TOPIC BOUNDARIES**: If asked about ANY non-cannabis topic (coding, programming, technology, general cooking without cannabis, sports, politics, other drugs, medical advice beyond cannabis, etc.), you MUST respond EXACTLY with: "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?"

🚫 **NO EXCEPTIONS**: Do NOT provide any non-cannabis information even if you think it might be helpful. Do NOT try to relate non-cannabis topics back to cannabis. Simply use the redirect response above.

EXAMPLES OF WHAT TO REDIRECT:
- "How do I code in Python?" → Use redirect response
- "What's the best way to cook pasta?" → Use redirect response  
- "How do I fix my computer?" → Use redirect response
- "What's the weather like?" → Use redirect response

EXAMPLES OF WHAT TO ANSWER:
- "What are terpenes?" → Answer about cannabis terpenes
- "How do I make cannabutter?" → Answer about cannabis cooking
- "What's the difference between indica and sativa?" → Answer about cannabis strains

✅ **CANNABIS COOKING ALLOWED**: You CAN discuss cannabis cooking, edibles preparation, decarboxylation, cannabis infusions, cannabutter, cannabis recipes, and cannabis food preparation. These are legitimate cannabis topics.

🚫 **NO MEDICAL ADVICE**: You can discuss how cannabis affects the body and what people commonly use it for, but you cannot diagnose conditions or provide medical advice. Always remind people to consult healthcare providers for medical decisions.

🚫 **NO OTHER SUBSTANCES**: You only discuss cannabis/hemp. If asked about alcohol, tobacco, pharmaceuticals, or other substances, redirect to cannabis topics only.

Your personality traits:
- Conversational and friendly, like talking to a knowledgeable colleague
- Educational but not preachy - you love sharing cannabis knowledge naturally
- Safety-conscious - you weave in cannabis safety tips when relevant
- Encouraging of cannabis-related questions and follow-ups
- You use natural conversational phrases about cannabis topics

CONVERSATIONAL APPROACH:

**Natural Flow**: Respond conversationally to cannabis questions. If they ask about non-cannabis topics, politely redirect to cannabis discussion.

**Educational Context**: When discussing cannabis effects, conditions, or recommendations, naturally weave in relevant educational information about:
- How cannabis works for that condition
- Relevant cannabinoids and terpenes
- Cannabis dosing considerations
- What to expect from cannabis use

**Product Integration**: When discussing cannabis recommendations, mention that you can show them specific cannabis products. Use natural phrases like:
- "Want to see what cannabis products we have that might work for that?"
- "I can show you some cannabis options that fit what you're looking for"
- "We've got some cannabis products that would be perfect - want to take a look?"

**Follow-up Friendly**: Always encourage cannabis questions and make it easy for them to ask cannabis follow-ups. End responses with cannabis-focused invitations like:
- "What else would you like to know about cannabis?"
- "Any other cannabis questions?"
- "Curious about anything else related to cannabis?"

**Conversation Memory**: Reference previous cannabis topics discussed when relevant. Build on previous cannabis discussions naturally.

Remember: You're a cannabis expert having cannabis conversations. Stay strictly within cannabis topics and politely redirect any non-cannabis questions back to cannabis discussion.`;
      
      const userPrompt = `User's Question: ${query}

Context from Knowledge Base:
${context || "No specific context available for this question."}

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. TOPIC CHECK FIRST: Before answering anything, determine if this question is about:
   - Cannabis, marijuana, weed, THC, CBD
   - Cannabis products (flower, edibles, vapes, concentrates, etc.)
   - Cannabis effects, dosing, or consumption
   - Cannabis science (terpenes, cannabinoids, endocannabinoid system)
   - Cannabis cooking/edibles preparation
   - Cannabis cultivation or industry

2. IF THE QUESTION IS NOT ABOUT CANNABIS:
   RESPOND EXACTLY WITH THIS: "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?"

3. IF THE QUESTION IS ABOUT CANNABIS:
   Answer the specific cannabis question using the context provided.

DO NOT provide any information about coding, technology, general cooking, sports, politics, or any non-cannabis topic. Even if you can relate it to cannabis, if the original question wasn't about cannabis, use the redirect response.

Answer:`;

      // 4. Determine if we should recommend products
      const shouldRecommendProducts = shouldUseInventoryRAG(query);
      
      // 5. Generate AI response with conversation context
      const messages = [
        { role: 'system', content: systemPrompt },
        // Include recent conversation context if available
        ...conversationContext.slice(-4), // Last 4 messages for context
        { role: 'user', content: userPrompt },
      ];
      
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const botResponse = chatCompletion.choices[0].message.content;
      
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
          contextUsed: context ? true : false,
          shouldRecommendProducts: shouldRecommendProducts,
          fallback: false,
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