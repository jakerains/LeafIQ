import { ProductWithVariant, TerpeneProfile, VibesToTerpenes } from '../types';
import { vibesToTerpenes } from '../data/demoData';
import { getAIRecommendations, logSearchQuery } from '../lib/supabase';

// Calculate similarity score between two terpene profiles
export const calculateTerpeneSimilarity = (
  targetProfile: TerpeneProfile,
  productProfile: TerpeneProfile
): number => {
  // If either profile is empty, return 0 similarity
  if (
    !targetProfile || 
    !productProfile || 
    Object.keys(targetProfile).length === 0 || 
    Object.keys(productProfile).length === 0
  ) {
    return 0;
  }
  
  let totalSimilarity = 0;
  let comparedTerpenes = 0;
  
  // Compare terpenes present in both profiles
  for (const [terpene, targetValue] of Object.entries(targetProfile)) {
    if (productProfile[terpene]) {
      // Calculate how similar the values are (1 - the normalized difference)
      const similarity = 1 - Math.abs((targetValue - productProfile[terpene]!) / Math.max(targetValue, productProfile[terpene]!));
      totalSimilarity += similarity;
      comparedTerpenes++;
    }
  }
  
  // If no terpenes were compared, return 0
  if (comparedTerpenes === 0) return 0;
  
  // Return average similarity
  return totalSimilarity / comparedTerpenes;
};

// Parse input vibe to determine target terpene profile
export const parseVibeToTerpeneProfile = (vibe: string): {
  terpeneProfile: TerpeneProfile;
  effects: string[];
} => {
  const lowercaseVibe = vibe.toLowerCase();

  // Check if this is an activity-based query
  const isActivityQuery = lowercaseVibe.startsWith('activity:');
  
  if (isActivityQuery) {
    const activity = lowercaseVibe.replace('activity:', '').trim();
    console.log('Processing activity query:', activity);
    
    // Map activities to appropriate vibes
    if (activity.includes('party') || activity.includes('social') || activity.includes('concert')) {
      return {
        terpeneProfile: vibesToTerpenes['social'].terpenes,
        effects: ['Social Enhancement', 'Energy', 'Mood Elevation']
      };
    } else if (activity.includes('creative') || activity.includes('art') || activity.includes('music')) {
      return {
        terpeneProfile: vibesToTerpenes['creative'].terpenes,
        effects: ['Creativity', 'Focus', 'Inspiration']
      };
    } else if (activity.includes('hike') || activity.includes('outdoor') || activity.includes('exercise')) {
      return {
        terpeneProfile: vibesToTerpenes['energized'].terpenes,
        effects: ['Energy', 'Focus', 'Physical Activity']
      };
    } else if (activity.includes('movie') || activity.includes('relax') || activity.includes('chill')) {
      return {
        terpeneProfile: vibesToTerpenes['relaxed'].terpenes,
        effects: ['Relaxation', 'Calm', 'Enjoyment']
      };
    } else {
      // Default activity profile is balanced
      return {
        terpeneProfile: {
          myrcene: 0.5,
          limonene: 0.5,
          pinene: 0.5,
          caryophyllene: 0.5
        },
        effects: ['Activity-Optimized', 'Balanced Experience']
      };
    }
  }
  
  // Regular vibe-based query
  // Check for direct matches in our mapping
  for (const [mappedVibe, data] of Object.entries(vibesToTerpenes)) {
    if (lowercaseVibe.includes(mappedVibe)) {
      return {
        terpeneProfile: data.terpenes,
        effects: data.effects
      };
    }
  }
  
  // No direct match found, use default terpene profile
  // This could be enhanced with NLP in a real implementation
  return {
    terpeneProfile: {
      myrcene: 0.5,
      limonene: 0.5,
      pinene: 0.5,
      caryophyllene: 0.5
    },
    effects: ['Custom Experience']
  };
};

// Calculate inventory score (prioritize products with good stock)
export const calculateInventoryScore = (inventoryLevel: number): number => {
  if (inventoryLevel <= 0) return 0;
  if (inventoryLevel <= 2) return 0.3; // Low stock
  if (inventoryLevel <= 9) return 0.7; // Medium stock
  return 1.0; // High stock
};

// Main recommendation function with AI integration
export const recommendProducts = async (
  products: ProductWithVariant[],
  vibe: string,
  userType: 'kiosk' | 'staff' = 'kiosk',
  maxResults = 3,
  organizationId?: string // Add organizationId parameter
): Promise<{ 
  products: ProductWithVariant[];
  effects: string[];
  isAIPowered: boolean;
}> => {
  console.log(`Processing recommendation request for: "${vibe}"`);
  
  try {
    // Try to get AI-powered recommendations first
    const aiResults = await getAIRecommendations(vibe);
    
    if (aiResults && aiResults.recommendations && aiResults.recommendations.length > 0) {
      console.log('AI recommendations received:', aiResults);
      
      // Map AI results to product objects
      const aiProductIds = aiResults.recommendations.map((rec: any) => rec.productId);
      const aiMatchedProducts = products.filter(p => aiProductIds.includes(p.id));
      
      // If we have matched products, return them
      if (aiMatchedProducts.length > 0) {
        // Only log search query if organizationId is provided
        if (organizationId) {
          logSearchQuery({
            search_phrase: vibe,
            user_type: userType,
            returned_product_ids: aiMatchedProducts.map(p => p.id),
            organization_id: organizationId
          });
        }
        
        console.log(`Returning ${aiMatchedProducts.length} AI-powered recommendations`);
        
        return {
          products: aiMatchedProducts.slice(0, maxResults),
          effects: aiResults.effects || ['AI Recommended'],
          isAIPowered: true
        };
      }
    }
    
    console.log('Falling back to local recommendation engine');
    
    // Fallback to local recommendation engine if AI fails or returns no results
    // Parse the vibe to get target terpene profile
    const { terpeneProfile: targetProfile, effects } = parseVibeToTerpeneProfile(vibe);
    
    // Filter out unavailable products
    const availableProducts = products.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    // If no products are available, return empty array
    if (availableProducts.length === 0) {
      console.log('No available products found');
      return { products: [], effects, isAIPowered: false };
    }
    
    // Score each product
    const scoredProducts = availableProducts.map(product => {
      const terpeneSimilarity = calculateTerpeneSimilarity(
        targetProfile,
        product.variant.terpene_profile
      );
      
      const inventoryScore = calculateInventoryScore(product.variant.inventory_level);
      
      // Combined score (terpene match is most important, inventory is secondary)
      const totalScore = (terpeneSimilarity * 0.8) + (inventoryScore * 0.2);
      
      return {
        product,
        score: totalScore
      };
    });
    
    // Sort by score (descending)
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
    
    // Only log search query if organizationId is provided
    if (organizationId) {
      logSearchQuery({
        search_phrase: vibe,
        user_type: userType,
        returned_product_ids: sortedProducts.slice(0, maxResults).map(p => p.id),
        organization_id: organizationId
      });
    }
    
    console.log(`Returning ${Math.min(sortedProducts.length, maxResults)} locally processed recommendations`);
    
    // Return top N results
    return { 
      products: sortedProducts.slice(0, maxResults),
      effects,
      isAIPowered: false
    };
  } catch (error) {
    console.error('Recommendation engine error:', error);
    
    // Final fallback: use the local engine without any Supabase interaction
    const { terpeneProfile: targetProfile, effects } = parseVibeToTerpeneProfile(vibe);
    const availableProducts = products.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    if (availableProducts.length === 0) {
      return { products: [], effects, isAIPowered: false };
    }
    
    const scoredProducts = availableProducts.map(product => {
      const terpeneSimilarity = calculateTerpeneSimilarity(
        targetProfile,
        product.variant.terpene_profile
      );
      const inventoryScore = calculateInventoryScore(product.variant.inventory_level);
      const totalScore = (terpeneSimilarity * 0.8) + (inventoryScore * 0.2);
      
      return {
        product,
        score: totalScore
      };
    });
    
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
    
    console.log(`Returning ${Math.min(sortedProducts.length, maxResults)} fallback recommendations`);
    
    return { 
      products: sortedProducts.slice(0, maxResults),
      effects,
      isAIPowered: false
    };
  }
};