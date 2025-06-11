import { ProductWithVariant, TerpeneProfile } from '../types';
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

// Generate personalized message for local recommendations
const generateLocalPersonalizedMessage = (vibe: string, effects: string[], categoryFilter?: string): string => {
  const lowercaseVibe = vibe.toLowerCase();
  
  // Check if this is an activity query
  if (lowercaseVibe.startsWith('activity:')) {
    const activity = lowercaseVibe.replace('activity:', '').trim();
    
    if (activity.includes('movie') || activity.includes('netflix') || activity.includes('watch')) {
      return "Perfect for movie night! I've selected products that will enhance your viewing experience with relaxing effects that won't put you to sleep. The edibles are great for long movie marathons.";
    } else if (activity.includes('hike') || activity.includes('hiking') || activity.includes('outdoor') || activity.includes('nature')) {
      return "Adventure awaits! These energizing yet grounding options will enhance your outdoor experience without weighing you down. The portable options are perfect for on-the-go enjoyment.";
    } else if (activity.includes('concert') || activity.includes('festival') || activity.includes('music')) {
      return "Let's make that concert unforgettable! I've recommended uplifting options that will keep you dancing and enhance the music experience. These are perfect for social events.";
    } else if (activity.includes('creative') || activity.includes('art') || activity.includes('painting') || activity.includes('writing')) {
      return "Time to unleash your creativity! These products enhance artistic flow and inspiration while keeping you focused. Perfect for creative projects and artistic endeavors.";
    } else if (activity.includes('social') || activity.includes('party') || activity.includes('friends')) {
      return "Get ready to socialize! These uplifting options will enhance conversation and laughter while keeping you comfortable in social settings.";
    } else if (activity.includes('exercise') || activity.includes('workout') || activity.includes('gym')) {
      return "Ready to get active? These energizing options will motivate your workout while helping with focus and endurance. Great for pre-workout preparation.";
    } else {
      return `Perfect for your ${activity}! I've selected products that will enhance your experience with the right balance of effects for your planned activity.`;
    }
  }
  
  // Regular vibe-based messages
  if (lowercaseVibe.includes('relax') || lowercaseVibe.includes('calm') || lowercaseVibe.includes('chill')) {
    return "Time to unwind! I've selected products with calming terpenes like linalool and myrcene that will help melt away stress and tension. Perfect for relaxation time.";
  } else if (lowercaseVibe.includes('energy') || lowercaseVibe.includes('energiz') || lowercaseVibe.includes('active')) {
    return "Ready to energize? These sativa-dominant options with uplifting terpenes will give you the boost you need without the jitters. Great for daytime activities!";
  } else if (lowercaseVibe.includes('creative') || lowercaseVibe.includes('creat') || lowercaseVibe.includes('inspir')) {
    return "Let your creativity flow! I've chosen products with terpenes like limonene and pinene that enhance creativity while keeping you focused and inspired.";
  } else if (lowercaseVibe.includes('focus') || lowercaseVibe.includes('concentrat')) {
    return "Time to focus! These products contain terpenes that enhance mental clarity and concentration, perfect for when you need to get things done.";
  } else if (lowercaseVibe.includes('sleep') || lowercaseVibe.includes('rest')) {
    return "Sweet dreams ahead! I've selected products with sedating terpenes like myrcene that will help you wind down and get quality rest.";
  } else if (lowercaseVibe.includes('pain') || lowercaseVibe.includes('relief')) {
    return "Relief is on the way! These products contain terpenes like caryophyllene and myrcene known for their pain-relieving and anti-inflammatory properties.";
  } else if (lowercaseVibe.includes('happy') || lowercaseVibe.includes('mood') || lowercaseVibe.includes('uplift')) {
    return "Time to lift your spirits! These mood-enhancing options with uplifting terpenes will help brighten your day and boost your overall mood.";
  } else if (lowercaseVibe.includes('social')) {
    return "Get ready to socialize! These products will enhance conversation and laughter while keeping you comfortable in social settings.";
  }
  
  // Category-specific messages
  if (categoryFilter) {
    if (categoryFilter === 'flower') {
      return "Classic flower power! I've selected premium flower products that offer the full spectrum cannabis experience with rich terpene profiles.";
    } else if (categoryFilter === 'edible') {
      return "Delicious and effective! These edibles provide long-lasting effects that are perfect for extended experiences. Remember to start low and go slow.";
    } else if (categoryFilter === 'vaporizer') {
      return "Clean and convenient! Vape products offer precise dosing and quick onset, perfect for when you want control over your experience.";
    } else if (categoryFilter === 'concentrate') {
      return "Potent and pure! These concentrates offer powerful effects for experienced users who appreciate high-quality extracts.";
    }
  }
  
  // Default message
  return "Based on what you're looking for, I've selected products that will give you a well-balanced experience. These options are versatile and perfect for various occasions.";
};

// Generate context factors for local recommendations
const generateLocalContextFactors = (vibe: string, categoryFilter?: string): string[] => {
  const lowercaseVibe = vibe.toLowerCase();
  const factors: string[] = [];
  
  // Activity-based factors
  if (lowercaseVibe.startsWith('activity:')) {
    const activity = lowercaseVibe.replace('activity:', '').trim();
    
    if (activity.includes('movie') || activity.includes('netflix')) {
      factors.push('relaxing', 'long-lasting', 'couch-friendly', 'entertainment-enhancing');
    } else if (activity.includes('hike') || activity.includes('outdoor')) {
      factors.push('portable', 'energizing', 'nature-friendly', 'adventure-ready');
    } else if (activity.includes('concert') || activity.includes('festival')) {
      factors.push('portable', 'discreet', 'social', 'music-enhancing');
    } else if (activity.includes('creative')) {
      factors.push('creativity-enhancing', 'focus', 'inspiration', 'artistic');
    } else if (activity.includes('social')) {
      factors.push('social-enhancing', 'conversation', 'comfortable', 'confident');
    } else if (activity.includes('exercise')) {
      factors.push('energizing', 'motivating', 'pre-workout', 'endurance');
    } else {
      factors.push('activity-optimized', 'versatile', 'balanced');
    }
  } else {
    // Vibe-based factors
    if (lowercaseVibe.includes('relax') || lowercaseVibe.includes('calm')) {
      factors.push('calming', 'stress-relief', 'comfortable', 'tension-relief');
    } else if (lowercaseVibe.includes('energy') || lowercaseVibe.includes('active')) {
      factors.push('energizing', 'daytime-appropriate', 'motivating', 'uplifting');
    } else if (lowercaseVibe.includes('creative')) {
      factors.push('creativity-enhancing', 'focus', 'inspiration', 'artistic');
    } else if (lowercaseVibe.includes('focus')) {
      factors.push('focusing', 'mental-clarity', 'productivity', 'concentration');
    } else if (lowercaseVibe.includes('sleep')) {
      factors.push('sedating', 'sleep-aid', 'nighttime', 'restful');
    } else if (lowercaseVibe.includes('pain')) {
      factors.push('pain-relief', 'anti-inflammatory', 'therapeutic', 'medicinal');
    } else if (lowercaseVibe.includes('happy') || lowercaseVibe.includes('mood')) {
      factors.push('mood-enhancing', 'uplifting', 'euphoric', 'joyful');
    } else if (lowercaseVibe.includes('social')) {
      factors.push('social-enhancing', 'conversation', 'laughter', 'comfortable');
    }
  }
  
  // Category-based factors
  if (categoryFilter) {
    if (categoryFilter === 'flower') {
      factors.push('full-spectrum', 'traditional', 'aromatic');
    } else if (categoryFilter === 'edible') {
      factors.push('long-lasting', 'discreet', 'precise-dosing');
    } else if (categoryFilter === 'vaporizer') {
      factors.push('portable', 'clean', 'quick-onset');
    } else if (categoryFilter === 'concentrate') {
      factors.push('potent', 'pure', 'experienced-user');
    }
  }
  
  // Add general factors if none were added
  if (factors.length === 0) {
    factors.push('balanced', 'versatile', 'reliable');
  }
  
  return factors;
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
    
    // Generate personalized message for local fallback
    const personalizedMessage = generateLocalPersonalizedMessage(vibe, effects, categoryFilter);
    const contextFactors = generateLocalContextFactors(vibe, categoryFilter);
    
    // Return top N results
    return { 
      products: paginatedProducts,
      effects,
      isAIPowered: false,
      personalizedMessage,
      contextFactors,
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
    
    // Generate personalized message for final fallback
    const personalizedMessage = generateLocalPersonalizedMessage(vibe, effects, categoryFilter);
    const contextFactors = generateLocalContextFactors(vibe, categoryFilter);
    
    return { 
      products: paginatedProducts,
      effects,
      isAIPowered: false,
      personalizedMessage,
      contextFactors,
      totalAvailable: sortedProducts.length
    };
  }
};