// Follow these steps to deploy this Edge Function to your Supabase project:
// 1. Run `supabase functions deploy ai-recommendations`
// 2. Set the OpenAI API key: `supabase secrets set OPENAI_API_KEY=your-api-key`

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

interface RequestData {
  vibe?: string;
  activity?: string;
  query: string;
}

interface AIRecommendation {
  productId: string;
  confidence: number;
  reason: string;
}

interface AIResponse {
  recommendations: AIRecommendation[];
  effects: string[];
  query_analyzed: string;
  personalizedMessage: string;
  contextFactors: string[];
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Parse request data
    const requestData: RequestData = await req.json();
    const { vibe, activity, query } = requestData;

    if (!query && !vibe && !activity) {
      return new Response(
        JSON.stringify({ error: 'Missing query parameter' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // If no OpenAI API key is provided, return a mock response
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key provided, returning mock recommendations');
      return new Response(
        JSON.stringify(getMockRecommendations(query, vibe, activity)),
        { headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Call GPT-4.1-nano-2025-04-14 API
    const aiResponse = await callGptApi(query || vibe || activity || '', vibe, activity);

    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI recommendations function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
};

async function callGptApi(query: string, vibe?: string, activity?: string): Promise<AIResponse> {
  const systemPrompt = `
    You are Bud Buddy, a friendly and knowledgeable cannabis recommendation assistant. Your task is to analyze a user's 
    desired vibe, activity, or general query and provide thoughtful, context-aware cannabis recommendations.

    IMPORTANT BOUNDARIES - YOU MUST FOLLOW THESE:
    🚫 **CANNABIS-ONLY EXPERTISE**: You are ONLY knowledgeable about cannabis, cannabis products, cannabis cultivation, cannabis effects, cannabis science, cannabis regulations, and cannabis cooking/edibles preparation. You have NO knowledge about anything else.

    🚫 **STRICT TOPIC BOUNDARIES**: If asked about ANY non-cannabis topic (coding, programming, technology, general cooking without cannabis, sports, politics, other drugs, medical advice beyond cannabis, etc.), you MUST respond with a JSON error format: {"error": "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?", "recommendations": [], "effects": [], "query_analyzed": "Non-cannabis topic detected", "personalizedMessage": "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?", "contextFactors": []}

    🚫 **NO EXCEPTIONS**: Do NOT provide any non-cannabis recommendations even if you think they might be helpful. Do NOT try to relate non-cannabis topics back to cannabis products. Simply use the error JSON format above.

    EXAMPLES OF WHAT TO REDIRECT:
    - "Help me code in Python" → Use error JSON format
    - "What's the best laptop?" → Use error JSON format  
    - "How do I cook pasta?" → Use error JSON format

    EXAMPLES OF WHAT TO ANSWER:
    - "I want to feel relaxed" → Provide cannabis recommendations
    - "What's good for sleep?" → Provide cannabis recommendations
    - "Help me make cannabutter" → Provide cannabis cooking product recommendations

    ✅ **CANNABIS COOKING ALLOWED**: You CAN recommend products for cannabis cooking, edibles preparation, decarboxylation, cannabis infusions, and cannabis food preparation. These are legitimate cannabis recommendations.

    🚫 **NO MEDICAL ADVICE**: You can discuss how cannabis affects the body and what people commonly use it for, but you cannot diagnose conditions or provide medical advice.

    🚫 **NO OTHER SUBSTANCES**: You only recommend cannabis/hemp products. If asked about alcohol, tobacco, pharmaceuticals, or other substances, use the error format above.
    
    When making CANNABIS recommendations, consider:
    - Terpene profiles that match the described feelings or activities
    - THC/CBD ratios appropriate for the desired effects
    - Cannabis strain types (sativa, indica, hybrid) that align with the experience
    - Cannabis product categories (flower, concentrate, edible, vaporizer, topical, tincture)
    - PRACTICAL FACTORS like convenience, discretion, duration, and setting
    
    For cannabis activities, think about:
    - Convenience (e.g., cannabis vapes for concerts/outdoor events, cannabis edibles for long activities)
    - Discretion needs (e.g., cannabis edibles or vapes for public settings)
    - Duration of cannabis effects (e.g., edibles last longer for all-day events)
    - Social vs solo cannabis activities
    - Physical vs mental cannabis activities
    
    ONLY respond with cannabis recommendations in this JSON format:
    1. "recommendations": An array of 3 objects describing ideal cannabis product characteristics:
       - "productId": Just use placeholder IDs like "rec1", "rec2", "rec3" 
       - "confidence": A number from 0-1 indicating confidence
       - "reason": A detailed explanation mentioning specific cannabis terpenes, effects, and product characteristics
       - "idealProfile": An object with suggested cannabis characteristics like:
         - "strainType": "indica", "sativa", or "hybrid"
         - "dominantTerpenes": array of terpene names
         - "thcRange": "low", "medium", or "high"
         - "preferredCategory": "flower", "concentrate", "edible", "vaporizer", "topical", "tincture"
    2. "effects": An array of strings describing expected cannabis effects (max 5)
    3. "query_analyzed": A detailed analysis of what cannabis experience the user is looking for
    4. "personalizedMessage": A friendly, conversational message explaining why you're recommending these cannabis products. 
       Start with acknowledging their specific cannabis request and explain how your cannabis recommendations will help.
       Keep it warm, helpful, and specific to their cannabis context. 2-3 sentences max.
    5. "contextFactors": An array of practical cannabis considerations you took into account (e.g., "portable", "discreet", "long-lasting")
  `;

  const userPrompt = vibe 
    ? `I want to feel ${vibe}. What cannabis products would you recommend?`
    : activity
    ? `I'm planning to ${activity}. What cannabis products would be best for this?`
    : `User Query: ${query}

CRITICAL: First check if this query is about cannabis, cannabis products, or cannabis-related topics. If NOT, use the error JSON format from your system prompt. If YES, provide cannabis product recommendations.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return getMockRecommendations(query, vibe, activity);
    }

    const data = await response.json();
    const responseContent = data.choices[0].message.content;
    
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', parseError);
      return getMockRecommendations(query, vibe, activity);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getMockRecommendations(query, vibe, activity);
  }
}

// Fallback function to provide mock recommendations if the API call fails
function getMockRecommendations(query: string, vibe?: string, activity?: string): AIResponse {
  const searchTerm = (query || vibe || activity || '').toLowerCase();
  
  // Check if the question is even cannabis-related
  const cannabisKeywords = ['cannabis', 'weed', 'marijuana', 'thc', 'cbd', 'strain', 'terpene', 'edible', 'vape', 'flower', 'indica', 'sativa', 'hybrid', 'dose', 'dosing', 'hemp', 'relax', 'energy', 'sleep', 'focus', 'pain', 'anxiety', 'decarb', 'infusion', 'cannabutter', 'canna-oil'];
  const isCannabisTopic = cannabisKeywords.some(keyword => searchTerm.includes(keyword));
  
  // Check for cannabis cooking/edibles context
  const cannabisCookingKeywords = ['cannabis cook', 'cannabis recipe', 'cannabis baking', 'edible recipe', 'cannabutter', 'canna-oil', 'cannabis infusion', 'decarboxylation', 'decarb', 'cannabis food', 'infused butter', 'infused oil', 'make edibles', 'cannabis chocolate', 'cannabis gummies'];
  const isCannabisCooking = cannabisCookingKeywords.some(keyword => searchTerm.includes(keyword));
  
  // Check for obvious non-cannabis topics
  const nonCannabisKeywords = ['code', 'coding', 'program', 'javascript', 'python', 'computer', 'software', 'algorithm', 'sport', 'politics', 'alcohol', 'beer', 'wine'];
  const isNonCannabisTopic = nonCannabisKeywords.some(keyword => searchTerm.includes(keyword));
  
  // Check for general cooking (not cannabis-related)
  const isGeneralCooking = (searchTerm.includes('recipe') || searchTerm.includes('cook') || searchTerm.includes('food') || searchTerm.includes('baking')) && !isCannabisCooking;
  
  if (isNonCannabisTopic || isGeneralCooking || (!isCannabisTopic && !isCannabisCooking && (searchTerm.includes('how to') || searchTerm.includes('what is') || searchTerm.includes('help me')))) {
    return {
      recommendations: [],
      effects: [],
      query_analyzed: "Non-cannabis topic detected",
      personalizedMessage: "I'm an AI bud tender, so I'm happy to talk about cannabis-related things. What would you like to know about cannabis?",
      contextFactors: []
    };
  }
  
  // Simple mapping of vibes to product IDs
  let productIds: string[] = [];
  let effects: string[] = [];
  
  if (searchTerm.includes('relax') || searchTerm.includes('calm') || searchTerm.includes('chill')) {
    productIds = ['p002', 'p006', 'p010'];
    effects = ['Relaxation', 'Stress Relief', 'Calm'];
  } else if (searchTerm.includes('sleep') || searchTerm.includes('rest')) {
    productIds = ['p006', 'p010', 'p014'];
    effects = ['Sedation', 'Sleep Aid', 'Muscle Relaxation'];
  } else if (searchTerm.includes('energy') || searchTerm.includes('active')) {
    productIds = ['p003', 'p005', 'p007'];
    effects = ['Energy', 'Focus', 'Uplift'];
  } else if (searchTerm.includes('creat') || searchTerm.includes('inspir')) {
    productIds = ['p001', 'p007', 'p009'];
    effects = ['Creativity', 'Euphoria', 'Mental Stimulation'];
  } else if (searchTerm.includes('pain') || searchTerm.includes('relief')) {
    productIds = ['p004', 'p010', 'p015'];
    effects = ['Pain Relief', 'Anti-inflammatory', 'Physical Comfort'];
  } else if (searchTerm.includes('focus') || searchTerm.includes('concentrat')) {
    productIds = ['p003', 'p007', 'p013'];
    effects = ['Focus', 'Mental Clarity', 'Alertness'];
  } else if (searchTerm.includes('happy') || searchTerm.includes('euphori')) {
    productIds = ['p001', 'p008', 'p011'];
    effects = ['Mood Elevation', 'Euphoria', 'Joy'];
  } else if (searchTerm.includes('social') || searchTerm.includes('talk')) {
    productIds = ['p001', 'p005', 'p008'];
    effects = ['Social Ease', 'Conversation', 'Laughter'];
  } else {
    // Default to a mix of products if no specific vibe is matched
    productIds = ['p001', 'p004', 'p008'];
    effects = ['Balanced Experience', 'Mood Enhancement', 'General Wellness'];
  }
  
  let personalizedMessage = '';
  let contextFactors: string[] = [];
  
  if (vibe) {
    if (searchTerm.includes('relax') || searchTerm.includes('calm') || searchTerm.includes('chill')) {
      personalizedMessage = "Since you're looking to relax and unwind, I've selected products known for their calming terpenes like linalool and myrcene. These will help melt away stress without leaving you too sedated.";
      contextFactors = ['calming', 'stress-relief', 'comfortable'];
    } else if (searchTerm.includes('creat') || searchTerm.includes('inspir')) {
      personalizedMessage = "Looking to tap into your creative side? I've chosen products with uplifting terpenes like limonene and pinene that enhance creativity while keeping you focused. Perfect for artistic endeavors!";
      contextFactors = ['creativity-enhancing', 'focus', 'uplifting'];
    } else if (searchTerm.includes('energy') || searchTerm.includes('active')) {
      personalizedMessage = "Ready to energize? These sativa-dominant options with terpenes like terpinolene will give you the boost you need without the jitters. Great for daytime activities!";
      contextFactors = ['energizing', 'daytime-appropriate', 'motivating'];
    }
  } else if (activity) {
    if (searchTerm.includes('concert') || searchTerm.includes('festival')) {
      personalizedMessage = "Let's make sure you have an amazing time at that concert! I've recommended portable vapes for convenience and edibles for long-lasting enjoyment. These uplifting options will keep you dancing all night.";
      contextFactors = ['portable', 'discreet', 'long-lasting', 'social'];
      productIds = ['p003', 'p005', 'p007'];
      effects = ['Energy', 'Euphoria', 'Social Enhancement', 'Music Appreciation'];
    } else if (searchTerm.includes('hike') || searchTerm.includes('outdoor')) {
      personalizedMessage = "Nature calls for the perfect companion! These energizing yet grounding options will enhance your outdoor adventure without weighing you down. The vapes are perfect for on-the-go enjoyment.";
      contextFactors = ['portable', 'energizing', 'nature-friendly'];
      productIds = ['p003', 'p007', 'p013'];
      effects = ['Energy', 'Focus', 'Nature Connection', 'Clarity'];
    } else if (searchTerm.includes('movie') || searchTerm.includes('netflix')) {
      personalizedMessage = "Movie night sorted! These relaxing options will enhance your viewing experience without putting you to sleep. The edibles are perfect for a long movie marathon.";
      contextFactors = ['relaxing', 'long-lasting', 'couch-friendly'];
      productIds = ['p002', 'p006', 'p010'];
      effects = ['Relaxation', 'Enhanced Sensory', 'Comfort', 'Giggly'];
    }
  }
  
  if (!personalizedMessage) {
    personalizedMessage = "Based on what you're looking for, I've selected products that will give you a well-balanced experience. These options are versatile and perfect for various occasions.";
    contextFactors = ['balanced', 'versatile', 'reliable'];
  }
  
  // Create mock recommendations
  const recommendations = productIds.map((id, index) => ({
    productId: id,
    confidence: 0.9 - (index * 0.1),
    reason: `This product's terpene profile aligns well with the desired "${searchTerm}" experience.`
  }));
  
  return {
    recommendations,
    effects,
    query_analyzed: `User is looking for products that ${vibe ? `induce a feeling of "${vibe}"` : activity ? `are suitable for "${activity}"` : `match "${query}"`}.`,
    personalizedMessage,
    contextFactors
  };
}

serve(handler);