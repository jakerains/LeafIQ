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

    // Call GPT-4.1-Mini API
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
    
    When making recommendations, consider:
    - Terpene profiles that match the described feelings or activities
    - THC/CBD ratios appropriate for the desired effects
    - Strain types (sativa, indica, hybrid) that align with the experience
    - Product categories (flower, concentrate, edible, vaporizer, topical, tincture)
    - PRACTICAL FACTORS like convenience, discretion, duration, and setting
    
    For activities, think about:
    - Convenience (e.g., vapes for concerts/outdoor events, edibles for long activities)
    - Discretion needs (e.g., edibles or vapes for public settings)
    - Duration of effects (e.g., edibles last longer for all-day events)
    - Social vs solo activities
    - Physical vs mental activities
    
    Respond with a JSON object containing:
    1. "recommendations": An array of 3 objects describing ideal product characteristics:
       - "productId": Just use placeholder IDs like "rec1", "rec2", "rec3" 
       - "confidence": A number from 0-1 indicating confidence
       - "reason": A detailed explanation mentioning specific terpenes, effects, and product characteristics
       - "idealProfile": An object with suggested characteristics like:
         - "strainType": "indica", "sativa", or "hybrid"
         - "dominantTerpenes": array of terpene names
         - "thcRange": "low", "medium", or "high"
         - "preferredCategory": "flower", "concentrate", "edible", "vaporizer", "topical", "tincture"
    2. "effects": An array of strings describing expected effects (max 5)
    3. "query_analyzed": A detailed analysis of what the user is looking for
    4. "personalizedMessage": A friendly, conversational message explaining why you're recommending these products. 
       Start with acknowledging their specific request and explain how your recommendations will help.
       Keep it warm, helpful, and specific to their context. 2-3 sentences max.
    5. "contextFactors": An array of practical considerations you took into account (e.g., "portable", "discreet", "long-lasting")
  `;

  const userPrompt = vibe 
    ? `I want to feel ${vibe}. What cannabis products would you recommend?`
    : activity
    ? `I'm planning to ${activity}. What cannabis products would be best for this?`
    : `${query}`;

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