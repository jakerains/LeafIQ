import { ProductWithVariant, TerpeneProfile, VibesToTerpenes } from '../types';
import { vibesToTerpenes } from '../data/demoData';
import { getTerpeneRecommendations, logSearchQuery } from '../lib/supabase';

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
    if (targetValue !== undefined && productProfile[terpene] !== undefined) {
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
  
  // Check if this is a cannabis education query
  if (lowercaseVibe.startsWith('cannabis question:')) {
    const question = lowercaseVibe.replace('cannabis question:', '').trim();
    console.log('Processing cannabis education query:', question);
    
    // For educational queries that mention specific effects or experiences
    if (question.includes('relax') || question.includes('sleep') || question.includes('anxiety')) {
      return {
        terpeneProfile: vibesToTerpenes['relaxed'].terpenes,
        effects: ['Educational', 'Relaxation', 'Calm']
      };
    }
    
    if (question.includes('energy') || question.includes('focus') || question.includes('alert')) {
      return {
        terpeneProfile: vibesToTerpenes['energized'].terpenes,
        effects: ['Educational', 'Energy', 'Focus']
      };
    }
    
    if (question.includes('pain') || question.includes('inflammation') || question.includes('relief')) {
      return {
        terpeneProfile: vibesToTerpenes['pain relief'].terpenes,
        effects: ['Educational', 'Pain Relief']
      };
    }
    
    if (question.includes('creat') || question.includes('inspire') || question.includes('art')) {
      return {
        terpeneProfile: vibesToTerpenes['creative'].terpenes,
        effects: ['Educational', 'Creativity']
      };
    }
    
    // Default profile for cannabis education - balanced
    return {
      terpeneProfile: {
        myrcene: 0.4,
        limonene: 0.4,
        pinene: 0.4,
        caryophyllene: 0.4
      },
      effects: ['Educational', 'Cannabis Information']
    };
  }
  
  // Check if this is a category-specific query
  if (lowercaseVibe.includes('concentrate') || lowercaseVibe.includes('extract')) {
    return {
      terpeneProfile: {
        myrcene: 0.5,
        limonene: 0.5,
        pinene: 0.5,
        caryophyllene: 0.6
      },
      effects: ['Potent Experience', 'Concentrated Effects']
    };
  }
  
  if (lowercaseVibe.includes('flower') || lowercaseVibe.includes('bud')) {
    return {
      terpeneProfile: {
        myrcene: 0.6,
        limonene: 0.4,
        pinene: 0.4,
        caryophyllene: 0.4
      },
      effects: ['Full Spectrum', 'Traditional Experience']
    };
  }
  
  if (lowercaseVibe.includes('edible')) {
    return {
      terpeneProfile: {
        myrcene: 0.7,
        limonene: 0.3,
        caryophyllene: 0.5
      },
      effects: ['Long-lasting', 'Body Effects']
    };
  }
  
  if (lowercaseVibe.includes('vape') || lowercaseVibe.includes('cartridge')) {
    return {
      terpeneProfile: {
        limonene: 0.7,
        pinene: 0.6,
        terpinolene: 0.5
      },
      effects: ['Quick Onset', 'Precise Dosing']
    };
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
  organizationId?: string,
  offset = 0 // Add offset parameter for pagination
): Promise<{ 
  products: ProductWithVariant[];
  effects: string[];
  isAIPowered: boolean;
  personalizedMessage?: string;
  contextFactors?: string[];
  totalAvailable?: number; // Add total count for pagination
}> => {
  console.log(`Processing recommendation request for: "${vibe}" (offset: ${offset})`);
  console.log(`Available products for recommendation: ${products.length}`);
  console.log(`Organization ID for recommendations: ${organizationId || 'Not provided'}`);
  
  // Check if this is a category-specific query
  const lowercaseVibe = vibe.toLowerCase();
  const categoryFilters: Record<string, string> = {
    'concentrate': 'concentrate',
    'concentrates': 'concentrate',
    'extracts': 'concentrate',
    'flower': 'flower',
    'buds': 'flower',
    'edible': 'edible',
    'edibles': 'edible',
    'vape': 'vaporizer',
    'vapes': 'vaporizer', 
    'cartridge': 'vaporizer',
    'cartridges': 'vaporizer',
    'vaporizer': 'vaporizer',
    'vaporizers': 'vaporizer'
  };
  
  let categoryFilter = '';
  
  // Check if any category keywords are in the query
  for (const [keyword, category] of Object.entries(categoryFilters)) {
    if (lowercaseVibe.includes(keyword)) {
      categoryFilter = category;
      break;
    }
  }
  
  try {
    // Try to get AI-powered recommendations first
    if (products.length === 0) {
      console.log('⚠️ No products available for recommendations');
      return { products: [], effects: [], isAIPowered: false, totalAvailable: 0 };
    }
    
    const aiResults = await getTerpeneRecommendations(vibe);
    
    if (aiResults && aiResults.recommendations && aiResults.recommendations.length > 0) {
      console.log('AI recommendations received:', aiResults);
      
      // Since AI returns fake product IDs (p001, p002, etc.), we need to map recommendations
      // to actual products based on the AI's confidence and reasoning
      let availableProducts = products.filter(p => 
        p.variant && p.variant.is_available && p.variant.inventory_level > 0
      );
      
      // Apply category filter if specified
      if (categoryFilter) {
        availableProducts = availableProducts.filter(p => p.category === categoryFilter);
      }
      
      if (availableProducts.length === 0) {
        console.log('No available products found for AI recommendations');
        // Fall through to local engine
      } else {
        // Use AI analysis to enhance local recommendations
        const { terpeneProfile: targetProfile, effects: localEffects } = parseVibeToTerpeneProfile(vibe);
        
        // Score products based on terpene similarity + AI insights
        const scoredProducts = availableProducts.map(product => {
          const terpeneSimilarity = calculateTerpeneSimilarity(
            targetProfile,
            product.variant.terpene_profile
          );
          
          const inventoryScore = calculateInventoryScore(product.variant.inventory_level);
          
          // Boost score for products that match AI-recommended characteristics
          let aiBoost = 0;
          const productName = product.name.toLowerCase();
          const productEffects = [product.strain_type, product.category].join(' ').toLowerCase();
          
          // Check if product aligns with AI-recommended effects
          if (aiResults.effects) {
            for (const effect of aiResults.effects) {
              if (productName.includes(effect.toLowerCase()) || 
                  productEffects.includes(effect.toLowerCase())) {
                aiBoost += 0.05;
              }
            }
          }
          
          // Check if product matches AI-recommended characteristics from idealProfile
          if (aiResults.recommendations && aiResults.recommendations.length > 0) {
            for (const rec of aiResults.recommendations) {
              if (rec.idealProfile) {
                // Match strain type
                if (rec.idealProfile.strainType && 
                    product.strain_type?.toLowerCase() === rec.idealProfile.strainType.toLowerCase()) {
                  aiBoost += 0.1;
                }
                
                // Match category
                if (rec.idealProfile.preferredCategory && 
                    product.category?.toLowerCase() === rec.idealProfile.preferredCategory.toLowerCase()) {
                  aiBoost += 0.05;
                }
                
                // Match dominant terpenes
                if (rec.idealProfile.dominantTerpenes && Array.isArray(rec.idealProfile.dominantTerpenes)) {
                  for (const terpene of rec.idealProfile.dominantTerpenes) {
                    if (productName.includes(terpene.toLowerCase())) {
                      aiBoost += 0.05;
                    }
                  }
                }
              }
            }
          }
          
          // Combined score with AI enhancement
          const totalScore = (terpeneSimilarity * 0.6) + (inventoryScore * 0.2) + (Math.min(aiBoost, 0.2) * 1.0);
          
          return {
            product,
            score: totalScore
          };
        });
        
        // Sort by score and apply pagination
        const sortedProducts = scoredProducts
          .sort((a, b) => b.score - a.score)
          .map(item => item.product);
        
        const paginatedProducts = sortedProducts.slice(offset, offset + maxResults);
        
        // Only log search query for the first page if organizationId is provided
        if (organizationId && offset === 0) {
          logSearchQuery(
            vibe,
            userType === 'kiosk' ? 'customer' : 'staff',
            paginatedProducts.map(p => p.id),
            organizationId
          ).catch(err => console.error('Error logging search query:', err));
        }
        
        console.log(`Returning ${paginatedProducts.length} AI-enhanced recommendations (${offset + 1}-${offset + paginatedProducts.length} of ${sortedProducts.length})`);
        
        return {
          products: paginatedProducts,
          effects: aiResults.effects || localEffects,
          isAIPowered: true,
          personalizedMessage: offset === 0 ? aiResults.personalizedMessage : undefined, // Only show message on first page
          contextFactors: offset === 0 ? aiResults.contextFactors : undefined,
          totalAvailable: sortedProducts.length
        };
      }
    }
    
    console.log('Falling back to local recommendation engine');
    
    // Fallback to local recommendation engine if AI fails or returns no results
    // Parse the vibe to get target terpene profile
    const { terpeneProfile: targetProfile, effects } = parseVibeToTerpeneProfile(vibe);
    
    // Filter products by category if needed
    let availableProducts = products.filter(p => 
      p.variant && p.variant.is_available && p.variant.inventory_level > 0
    );
    
    if (categoryFilter) {
      availableProducts = availableProducts.filter(p => p.category === categoryFilter);
    }
    
    // If no products are available, return empty array
    if (availableProducts.length === 0) {
      console.log('No available products found');
      return { products: [], effects, isAIPowered: false, totalAvailable: 0 };
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
    
    // Sort by score (descending) and apply pagination
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
      
    const paginatedProducts = sortedProducts.slice(offset, offset + maxResults);
    
    // Log search query for first page if organizationId is provided
    if (organizationId && offset === 0) {
      logSearchQuery(
        vibe,
        userType === 'kiosk' ? 'customer' : 'staff',
        paginatedProducts.map(p => p.id),
        organizationId
      ).catch(err => console.error('Error logging search query:', err));
    }
    
    console.log(`Returning ${paginatedProducts.length} locally processed recommendations (${offset + 1}-${offset + paginatedProducts.length} of ${sortedProducts.length})`);
    
    // Return top N results
    return { 
      products: paginatedProducts,
      effects,
      isAIPowered: false,
      totalAvailable: sortedProducts.length
    };
  } catch (error) {
    console.error('Recommendation engine error:', error);
    
    // Final fallback: use the local engine without any Supabase interaction
    const { terpeneProfile: targetProfile, effects } = parseVibeToTerpeneProfile(vibe);
    
    // Filter products by category if needed
    let availableProducts = products.filter(p => 
      p.variant && p.variant.is_available && p.variant.inventory_level > 0
    );
    
    if (categoryFilter) {
      availableProducts = availableProducts.filter(p => p.category === categoryFilter);
    }
    
    if (availableProducts.length === 0) {
      return { products: [], effects, isAIPowered: false, totalAvailable: 0 };
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
      
    const paginatedProducts = sortedProducts.slice(offset, offset + maxResults);
    
    console.log(`Returning ${paginatedProducts.length} fallback recommendations (${offset + 1}-${offset + paginatedProducts.length} of ${sortedProducts.length})`);
    
    return { 
      products: paginatedProducts,
      effects,
      isAIPowered: false,
      totalAvailable: sortedProducts.length
    };
  }
};