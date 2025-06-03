// Follow these steps to deploy this Edge Function to your Supabase project:
// 1. Run `supabase functions deploy ai-recommendations`
// 2. Set the OpenAI API key: `supabase secrets set OPENAI_API_KEY=your-api-key`

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

interface RequestData {
  vibe: string;
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
    const { vibe } = requestData;

    if (!vibe) {
      return new Response(
        JSON.stringify({ error: 'Missing vibe parameter' }),
        { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // If no OpenAI API key is provided, return a mock response
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key provided, returning mock recommendations');
      return new Response(
        JSON.stringify(getMockRecommendations(vibe)),
        { headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Call GPT-4.1-Mini API
    const aiResponse = await callGptApi(vibe);

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

async function callGptApi(vibe: string): Promise<AIResponse> {
  const systemPrompt = `
    You are an expert cannabis recommendation system. Your task is to analyze a user's 
    desired "vibe" or experience and recommend the most suitable cannabis products.
    
    Consider the following when making recommendations:
    - Terpene profiles that match the described feelings
    - THC/CBD ratios appropriate for the desired effects
    - Strain types (sativa, indica, hybrid) that align with the experience
    
    Respond with a JSON object containing:
    1. "recommendations": An array of objects, each with:
       - "productId": A string product ID (format: p001-p015)
       - "confidence": A number from 0-1 indicating confidence
       - "reason": A brief explanation for this recommendation
    2. "effects": An array of strings describing expected effects
    3. "query_analyzed": A brief analysis of what the user is looking for
    
    Analyze the user's query intelligently and provide thoughtful matches.
  `;

  const userPrompt = `Based on my desire to feel "${vibe}", what cannabis products would you recommend?`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini', // Changed from 'gpt-4o-mini' to 'gpt-4.1-mini'
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
      return getMockRecommendations(vibe);
    }

    const data = await response.json();
    const responseContent = data.choices[0].message.content;
    
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', parseError);
      return getMockRecommendations(vibe);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getMockRecommendations(vibe);
  }
}

// Fallback function to provide mock recommendations if the API call fails
function getMockRecommendations(vibe: string): AIResponse {
  const lowercaseVibe = vibe.toLowerCase();
  
  // Simple mapping of vibes to product IDs
  let productIds: string[] = [];
  let effects: string[] = [];
  
  if (lowercaseVibe.includes('relax') || lowercaseVibe.includes('calm') || lowercaseVibe.includes('chill')) {
    productIds = ['p002', 'p006', 'p010'];
    effects = ['Relaxation', 'Stress Relief', 'Calm'];
  } else if (lowercaseVibe.includes('sleep') || lowercaseVibe.includes('rest')) {
    productIds = ['p006', 'p010', 'p014'];
    effects = ['Sedation', 'Sleep Aid', 'Muscle Relaxation'];
  } else if (lowercaseVibe.includes('energy') || lowercaseVibe.includes('active')) {
    productIds = ['p003', 'p005', 'p007'];
    effects = ['Energy', 'Focus', 'Uplift'];
  } else if (lowercaseVibe.includes('creat') || lowercaseVibe.includes('inspir')) {
    productIds = ['p001', 'p007', 'p009'];
    effects = ['Creativity', 'Euphoria', 'Mental Stimulation'];
  } else if (lowercaseVibe.includes('pain') || lowercaseVibe.includes('relief')) {
    productIds = ['p004', 'p010', 'p015'];
    effects = ['Pain Relief', 'Anti-inflammatory', 'Physical Comfort'];
  } else if (lowercaseVibe.includes('focus') || lowercaseVibe.includes('concentrat')) {
    productIds = ['p003', 'p007', 'p013'];
    effects = ['Focus', 'Mental Clarity', 'Alertness'];
  } else if (lowercaseVibe.includes('happy') || lowercaseVibe.includes('euphori')) {
    productIds = ['p001', 'p008', 'p011'];
    effects = ['Mood Elevation', 'Euphoria', 'Joy'];
  } else if (lowercaseVibe.includes('social') || lowercaseVibe.includes('talk')) {
    productIds = ['p001', 'p005', 'p008'];
    effects = ['Social Ease', 'Conversation', 'Laughter'];
  } else {
    // Default to a mix of products if no specific vibe is matched
    productIds = ['p001', 'p004', 'p008'];
    effects = ['Balanced Experience', 'Mood Enhancement', 'General Wellness'];
  }
  
  // Create mock recommendations
  const recommendations = productIds.map((id, index) => ({
    productId: id,
    confidence: 0.9 - (index * 0.1),
    reason: `This product's terpene profile aligns well with the desired "${vibe}" experience.`
  }));
  
  return {
    recommendations,
    effects,
    query_analyzed: `User is looking for products that induce a feeling of "${vibe}".`
  };
}

serve(handler);