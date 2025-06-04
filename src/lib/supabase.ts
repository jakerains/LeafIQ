import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Initialize the Supabase client with environment variables
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Auth functions

export const signUp = async (
  email: string,
  password: string,
  dispensaryName: string,
  metadata: {
    useMode: string;
    menuSource: string;
    enableDemoInventory: boolean;
    locationZip?: string;
    referralCode?: string;
    fullName?: string;
    phoneNumber?: string;
    wantOnboardingHelp?: boolean;
  }
) => {
  // Register user with Supabase Auth
  const signUpResult = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        dispensary_name: dispensaryName,
        ...metadata,
      },
    },
  });

  return signUpResult;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.user;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.session;
};

// Product and inventory functions

export const fetchProducts = async (organizationId: string) => {
  console.log('📊 fetchProducts called with organizationId:', organizationId);
  
  if (!organizationId) {
    console.error('No organizationId provided to fetchProducts');
    return { products: [], variants: [] };
  }

  try {
    // First, get all products for the organization
    // Use explicit table name to avoid ambiguous column reference
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('products.organization_id', organizationId);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error(`Error fetching products: ${productsError.message}`);
    }

    console.log(`Found ${products?.length || 0} products`);

    if (!products || products.length === 0) {
      return { products: [], variants: [] };
    }

    // Get all product IDs to fetch variants
    const productIds = products.map(p => p.id);

    // Fetch variants for these products
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      console.error('Error fetching variants:', variantsError);
      throw new Error(`Error fetching variants: ${variantsError.message}`);
    }

    console.log(`Found ${variants?.length || 0} variants`);

    return { products: products || [], variants: variants || [] };
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
};

// Terpene AI recommendation functions

export const getTerpeneRecommendations = async (query: string) => {
  try {
    // Determine if this is a vibe or activity query
    let requestBody: { query: string; vibe?: string; activity?: string } = { query };
    
    if (query.toLowerCase().startsWith('activity:')) {
      const activity = query.replace(/^activity:\s*/i, '').trim();
      requestBody = { query, activity };
    } else {
      requestBody = { query, vibe: query };
    }
    
    const response = await supabase.functions.invoke('ai-recommendations', {
      body: requestBody
    });

    if (response.error) {
      throw new Error(`Error getting recommendations: ${response.error.message}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error getting terpene recommendations:', error);
    throw error;
  }
};

// Cannabis knowledge functions

// Fallback responses for when the edge function cannot be reached
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

export const getCannabisKnowledgeResponse = async (query: string): Promise<{ answer: string; shouldRecommendProducts?: boolean }> => {
  if (!query.trim()) {
    return { answer: "Please ask a question about cannabis." };
  }
  
  try {
    console.log('Calling cannabis-knowledge-rag function with query:', query);
    
    // Try to invoke the Edge Function
    const response = await supabase.functions.invoke('cannabis-knowledge-rag', {
      body: { query }
    });
    
    if (response.error) {
      throw new Error(`Error calling cannabis-knowledge-rag function: ${response.error.message}`);
    }
    
    return {
      answer: response.data?.answer || "I couldn't find information about that topic.",
      shouldRecommendProducts: response.data?.should_recommend_products || false
    };
    
  } catch (error) {
    console.error('Failed to get cannabis knowledge response:', error);
    
    // Check if any fallback keywords match the query
    const lowerQuery = query.toLowerCase();
    let fallbackResponse = "I'm sorry, I couldn't connect to the knowledge base at the moment. ";
    
    // Find matching fallback responses
    const matchingKeywords = Object.keys(FALLBACK_RESPONSES).filter(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    );
    
    if (matchingKeywords.length > 0) {
      // Use the longest matching keyword for the most specific response
      const bestMatch = matchingKeywords.sort((a, b) => b.length - a.length)[0];
      fallbackResponse += FALLBACK_RESPONSES[bestMatch];
    } else {
      fallbackResponse += "Please try again later or ask about terpenes, THC, CBD, indica, sativa, hybrids, edibles, or the entourage effect.";
    }
    
    return { answer: fallbackResponse };
  }
};

// Function to log search queries
export const logSearchQuery = async (
  searchPhrase: string,
  userType: 'customer' | 'staff' | 'admin',
  returnedProductIds: string[] = [],
  organizationId?: string
) => {
  try {
    const { error } = await supabase.from('search_queries').insert({
      search_phrase: searchPhrase,
      user_type: userType,
      returned_product_ids: returnedProductIds,
      organization_id: organizationId
    });

    if (error) {
      console.error('Error logging search query:', error);
    }
  } catch (err) {
    console.error('Failed to log search query:', err);
  }
};