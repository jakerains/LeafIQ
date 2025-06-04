import { useProductsStore } from '../stores/productsStore';
import { ProductWithVariant } from '../types';

/**
 * Utility functions for Bud to access real-time inventory data
 * These functions provide contextual product information for educational responses
 */

export interface InventoryContext {
  totalProducts: number;
  availableProducts: ProductWithVariant[];
  categories: string[];
  strainTypes: string[];
  thcRange: { min: number; max: number };
  topBrands: string[];
}

export interface InventoryRAGContext {
  shouldUseInventory: boolean;
  relevantProducts: ProductWithVariant[];
  inventoryStats: {
    totalProducts: number;
    thcRange: { min: number; max: number };
    categories: string[];
    strainTypes: string[];
    topBrands: string[];
  };
  contextSummary: string;
}

/**
 * Determine if a question should trigger inventory RAG lookup
 * This analyzes the user's question to see if product information would be helpful
 * Updated to be more selective - only show products for direct requests or application questions
 */
export function shouldUseInventoryRAG(query: string): boolean {
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
                                 lowerQuery.includes('recommend') ||
                                 lowerQuery.includes('which') ||
                                 lowerQuery.includes('best for') ||
                                 lowerQuery.includes('products') ||
                                 lowerQuery.includes('strains') ||
                                 lowerQuery.includes('options');
    
    if (!hasApplicationContext) {
      return false; // Pure educational - no products
    }
  }
  
  // Direct product/inventory requests (always show products)
  const directProductKeywords = [
    'strain', 'strains', 'product', 'products', 'flower', 'bud', 'buds',
    'edible', 'edibles', 'gummies', 'chocolate', 'vape', 'vapes', 'cartridge',
    'concentrate', 'concentrates', 'wax', 'shatter', 'rosin', 'hash',
    'tincture', 'tinctures', 'topical', 'topicals', 'pre-roll', 'preroll',
    'joint', 'joints', 'brand', 'brands', 'inventory', 'stock', 'available',
    'carry', 'have', 'sell', 'offer'
  ];
  
  // Recommendation/application keywords (show products when combined with effects)
  const applicationKeywords = [
    'recommend', 'suggestion', 'suggest', 'best', 'good for', 'help with',
    'which', 'what should', 'show me', 'find me', 'looking for',
    'need something', 'want something', 'options for', 'choices for'
  ];
  
  // Effect keywords that make sense with product recommendations
  const effectApplicationKeywords = [
    'anxiety', 'stress', 'pain', 'sleep', 'insomnia', 'energy', 'focus',
    'creative', 'creativity', 'relaxing', 'uplifting', 'euphoric', 'calm',
    'appetite', 'nausea', 'inflammation', 'depression', 'mood'
  ];
  
  // Strain type questions that imply wanting product examples
  const strainTypeApplications = [
    'indica do', 'sativa do', 'hybrid do', 'indica for', 'sativa for', 'hybrid for',
    'indica help', 'sativa help', 'hybrid help', 'indica good', 'sativa good',
    'indica options', 'sativa options', 'hybrid options'
  ];
  
  // Check for direct product requests
  if (directProductKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return true;
  }
  
  // Check for recommendation requests
  if (applicationKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return true;
  }
  
  // Check for strain type application questions
  if (strainTypeApplications.some(phrase => lowerQuery.includes(phrase))) {
    return true;
  }
  
  // Check for effect-based questions that imply wanting product help
  const hasEffectKeyword = effectApplicationKeywords.some(keyword => lowerQuery.includes(keyword));
  const hasApplicationPhrase = ['help with', 'good for', 'best for', 'treat', 'relief'].some(phrase => lowerQuery.includes(phrase));
  
  if (hasEffectKeyword && hasApplicationPhrase) {
    return true;
  }
  
  return false; // Default to no products for general questions
}

/**
 * Get relevant inventory context for a user's question (RAG approach)
 * This fetches and analyzes inventory to provide context for Bud's response
 */
export async function getInventoryRAGContext(
  query: string,
  organizationId: string
): Promise<InventoryRAGContext> {
  const shouldUse = shouldUseInventoryRAG(query);
  
  if (!shouldUse) {
    return {
      shouldUseInventory: false,
      relevantProducts: [],
      inventoryStats: {
        totalProducts: 0,
        thcRange: { min: 0, max: 0 },
        categories: [],
        strainTypes: [],
        topBrands: []
      },
      contextSummary: ''
    };
  }
  
  try {
    const { fetchProducts } = useProductsStore.getState();
    
    // Ensure we have fresh data
    await fetchProducts();
    
    // Get the current products from the store
    const allProducts = useProductsStore.getState().productsWithVariants;
    
    // Filter for available products with inventory
    const availableProducts = allProducts.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    // Find products relevant to the query
    const relevantProducts = await findRelevantProductsForQuery(query, availableProducts);
    
    // Generate inventory stats
    const categories = [...new Set(availableProducts.map(p => p.category))];
    const strainTypes = [...new Set(availableProducts.map(p => p.strain_type))];
    const brands = [...new Set(availableProducts.map(p => p.brand))];
    
    const thcValues = availableProducts
      .map(p => p.thc_percentage || 0)
      .filter(thc => thc > 0);
    
    const thcRange = {
      min: thcValues.length > 0 ? Math.min(...thcValues) : 0,
      max: thcValues.length > 0 ? Math.max(...thcValues) : 0
    };
    
    const topBrands = brands.slice(0, 5);
    
    // Generate context summary for Bud to use
    const contextSummary = generateContextSummary(
      query,
      relevantProducts,
      {
        totalProducts: availableProducts.length,
        thcRange,
        categories,
        strainTypes,
        topBrands
      }
    );
    
    return {
      shouldUseInventory: true,
      relevantProducts,
      inventoryStats: {
        totalProducts: availableProducts.length,
        thcRange,
        categories,
        strainTypes,
        topBrands
      },
      contextSummary
    };
    
  } catch (error) {
    console.error('Error getting inventory RAG context:', error);
    return {
      shouldUseInventory: false,
      relevantProducts: [],
      inventoryStats: {
        totalProducts: 0,
        thcRange: { min: 0, max: 0 },
        categories: [],
        strainTypes: [],
        topBrands: []
      },
      contextSummary: ''
    };
  }
}

/**
 * Find products relevant to a specific query using advanced matching
 */
async function findRelevantProductsForQuery(
  query: string,
  availableProducts: ProductWithVariant[]
): Promise<ProductWithVariant[]> {
  const lowerQuery = query.toLowerCase();
  let relevantProducts: ProductWithVariant[] = [];
  
  // Direct product/brand name matches (highest priority)
  const directMatches = availableProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery)
  );
  relevantProducts = [...relevantProducts, ...directMatches];
  
  // Category matches
  if (lowerQuery.includes('flower') || lowerQuery.includes('bud')) {
    const flowerProducts = availableProducts.filter(p => p.category === 'flower');
    relevantProducts = [...relevantProducts, ...flowerProducts.slice(0, 3)];
  }
  
  if (lowerQuery.includes('edible') || lowerQuery.includes('gummies') || lowerQuery.includes('chocolate')) {
    const edibleProducts = availableProducts.filter(p => p.category === 'edible');
    relevantProducts = [...relevantProducts, ...edibleProducts.slice(0, 3)];
  }
  
  if (lowerQuery.includes('vape') || lowerQuery.includes('cartridge') || lowerQuery.includes('pen')) {
    const vapeProducts = availableProducts.filter(p => p.category === 'vaporizer');
    relevantProducts = [...relevantProducts, ...vapeProducts.slice(0, 3)];
  }
  
  if (lowerQuery.includes('concentrate') || lowerQuery.includes('wax') || lowerQuery.includes('shatter')) {
    const concentrateProducts = availableProducts.filter(p => p.category === 'concentrate');
    relevantProducts = [...relevantProducts, ...concentrateProducts.slice(0, 3)];
  }
  
  // Strain type matches
  if (lowerQuery.includes('indica')) {
    const indicaProducts = availableProducts.filter(p => p.strain_type === 'indica');
    relevantProducts = [...relevantProducts, ...indicaProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('sativa')) {
    const sativaProducts = availableProducts.filter(p => p.strain_type === 'sativa');
    relevantProducts = [...relevantProducts, ...sativaProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('hybrid')) {
    const hybridProducts = availableProducts.filter(p => p.strain_type === 'hybrid');
    relevantProducts = [...relevantProducts, ...hybridProducts.slice(0, 2)];
  }
  
  // THC/CBD level matches
  if (lowerQuery.includes('high thc') || lowerQuery.includes('potent') || lowerQuery.includes('strong')) {
    const highThcProducts = availableProducts
      .filter(p => (p.variant.thc_percentage || 0) > 25)
      .sort((a, b) => (b.variant.thc_percentage || 0) - (a.variant.thc_percentage || 0));
    relevantProducts = [...relevantProducts, ...highThcProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('low thc') || lowerQuery.includes('mild') || lowerQuery.includes('cbd')) {
    const lowThcProducts = availableProducts
      .filter(p => (p.variant.thc_percentage || 0) < 20 || (p.variant.cbd_percentage || 0) > 5)
      .sort((a, b) => (a.variant.thc_percentage || 0) - (b.variant.thc_percentage || 0));
    relevantProducts = [...relevantProducts, ...lowThcProducts.slice(0, 2)];
  }
  
  // Terpene matches
  if (lowerQuery.includes('terpene') || lowerQuery.includes('terp') || 
      lowerQuery.includes('myrcene') || lowerQuery.includes('limonene') ||
      lowerQuery.includes('pinene') || lowerQuery.includes('linalool')) {
    const terpeneProducts = availableProducts.filter(p =>
      p.variant.terpene_profile && Object.keys(p.variant.terpene_profile).length > 0
    );
    relevantProducts = [...relevantProducts, ...terpeneProducts.slice(0, 3)];
  }
  
  // Effect-based matches (basic heuristics)
  if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia') || lowerQuery.includes('relax')) {
    const relaxingProducts = availableProducts.filter(p => 
      p.strain_type === 'indica' || 
      (p.variant.terpene_profile && p.variant.terpene_profile.myrcene && p.variant.terpene_profile.myrcene > 0.5)
    );
    relevantProducts = [...relevantProducts, ...relaxingProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('energy') || lowerQuery.includes('focus') || lowerQuery.includes('creative')) {
    const energizingProducts = availableProducts.filter(p => 
      p.strain_type === 'sativa' ||
      (p.variant.terpene_profile && p.variant.terpene_profile.limonene && p.variant.terpene_profile.limonene > 0.5)
    );
    relevantProducts = [...relevantProducts, ...energizingProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('pain') || lowerQuery.includes('relief') || lowerQuery.includes('ache')) {
    const painReliefProducts = availableProducts.filter(p =>
      (p.variant.terpene_profile && p.variant.terpene_profile.caryophyllene && p.variant.terpene_profile.caryophyllene > 0.3) ||
      (p.variant.terpene_profile && p.variant.terpene_profile.myrcene && p.variant.terpene_profile.myrcene > 0.5) ||
      (p.variant.cbd_percentage && p.variant.cbd_percentage > 1)
    );
    relevantProducts = [...relevantProducts, ...painReliefProducts.slice(0, 2)];
  }
  
  // Remove duplicates and limit results
  const uniqueProducts = relevantProducts.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  
  return uniqueProducts.slice(0, 5); // Limit to top 5 most relevant
}

/**
 * Generate a context summary for Bud to use in his response
 */
function generateContextSummary(
  query: string,
  relevantProducts: ProductWithVariant[],
  stats: {
    totalProducts: number;
    thcRange: { min: number; max: number };
    categories: string[];
    strainTypes: string[];
    topBrands: string[];
  }
): string {
  let summary = `INVENTORY CONTEXT: We have ${stats.totalProducts} products available. `;
  
  if (stats.thcRange.max > 0) {
    summary += `THC range: ${stats.thcRange.min.toFixed(1)}%-${stats.thcRange.max.toFixed(1)}%. `;
  }
  
  if (stats.categories.length > 0) {
    summary += `Categories: ${stats.categories.join(', ')}. `;
  }
  
  if (stats.strainTypes.length > 0) {
    summary += `Strain types: ${stats.strainTypes.join(', ')}. `;
  }
  
  if (relevantProducts.length > 0) {
    summary += `RELEVANT PRODUCTS: `;
    relevantProducts.forEach((product, index) => {
      summary += `${index + 1}. ${product.name} by ${product.brand} (${product.strain_type}, ${product.variant.thc_percentage?.toFixed(1)}% THC, $${product.variant.price})`;
      
      if (product.variant.terpene_profile && Object.keys(product.variant.terpene_profile).length > 0) {
        const topTerpenes = Object.entries(product.variant.terpene_profile)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 2)
          .map(([name]) => name);
        summary += ` - Top terpenes: ${topTerpenes.join(', ')}`;
      }
      
      summary += `. `;
    });
  }
  
  return summary;
}

/**
 * Format product details for display
 */
export function formatProductRecommendation(product: ProductWithVariant): string {
  const variant = product.variant;
  const thc = variant?.thc_percentage ? `${variant.thc_percentage.toFixed(1)}% THC` : 'THC info unavailable';
  const cbd = variant?.cbd_percentage && variant.cbd_percentage > 0 ? `, ${variant.cbd_percentage.toFixed(1)}% CBD` : '';
  const stock = variant?.inventory_level || 0;
  const price = variant?.price ? `$${variant.price.toFixed(2)}` : 'Price varies';
  
  const topTerpenes = variant?.terpene_profile ? 
    Object.entries(variant.terpene_profile)
      .filter(([_, value]) => (value as number) > 0.05)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 2)
      .map(([name, _]) => name)
      .join(', ') : '';
  
  return `${product.name} by ${product.brand} (${thc}${cbd}) - ${stock} units in stock at ${price}${topTerpenes ? `. Rich in ${topTerpenes} terpenes` : ''}`;
}

/**
 * Get current inventory context for the organization
 * Uses the same data source as the admin inventory page
 */
export async function getInventoryContext(organizationId: string): Promise<InventoryContext> {
  const { fetchProducts, productsWithVariants } = useProductsStore.getState();
  
  try {
    // Ensure we have fresh data
    await fetchProducts();
    
    // Get the current products from the store (same as admin inventory)
    const products = useProductsStore.getState().productsWithVariants;
    
    // Filter for available products with inventory
    const availableProducts = products.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    const categories = [...new Set(availableProducts.map(p => p.category))];
    const strainTypes = [...new Set(availableProducts.map(p => p.strain_type))];
    const brands = [...new Set(availableProducts.map(p => p.brand))];
    
    // Calculate THC range
    const thcValues = availableProducts
      .map(p => p.thc_percentage || 0)
      .filter(thc => thc > 0);
    
    const thcRange = {
      min: thcValues.length > 0 ? Math.min(...thcValues) : 0,
      max: thcValues.length > 0 ? Math.max(...thcValues) : 0
    };
    
    // Get top brands by product count
    const brandCounts = brands.reduce((acc, brand) => {
      acc[brand] = availableProducts.filter(p => p.brand === brand).length;
      return acc;
    }, {} as Record<string, number>);
    
    const topBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([brand]) => brand);
    
    return {
      totalProducts: availableProducts.length,
      availableProducts,
      categories,
      strainTypes,
      thcRange,
      topBrands
    };
  } catch (error) {
    console.error('Error getting inventory context:', error);
    return {
      totalProducts: 0,
      availableProducts: [],
      categories: [],
      strainTypes: [],
      thcRange: { min: 0, max: 0 },
      topBrands: []
    };
  }
}

/**
 * Analyze inventory for specific needs
 * This function is used to find products for specific customer needs
 */
export async function analyzeInventoryForNeed(
  need: string,
  organizationId?: string
): Promise<ProductWithVariant[]> {
  try {
    // Get fresh inventory data
    const { fetchProducts } = useProductsStore.getState();
    await fetchProducts();
    
    // Get current products from store
    const allProducts = useProductsStore.getState().productsWithVariants;
    
    // Filter for available products with inventory
    const availableProducts = allProducts.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    // Handle different need categories
    const lowerNeed = need.toLowerCase();
    
    if (lowerNeed.includes('anxiety') || lowerNeed.includes('stress')) {
      return availableProducts
        .filter(p => {
          const variant = p.variant;
          const hasCalming = variant?.terpene_profile && (
            (variant.terpene_profile.linalool > 0.1) ||
            (variant.terpene_profile.caryophyllene > 0.1) ||
            (variant.terpene_profile.myrcene > 0.2)
          );
          const hasGoodRatio = variant?.cbd_percentage && variant.cbd_percentage > 0.5 || 
            (variant?.thc_percentage && variant?.cbd_percentage && 
             variant.thc_percentage / variant.cbd_percentage < 3);
          
          return hasCalming || hasGoodRatio;
        })
        .sort((a, b) => (b.variant?.cbd_percentage || 0) - (a.variant?.cbd_percentage || 0))
        .slice(0, 3);
    }
    
    if (lowerNeed.includes('indica')) {
      return availableProducts
        .filter(p => p.strain_type === 'indica')
        .sort((a, b) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (lowerNeed.includes('sativa')) {
      return availableProducts
        .filter(p => p.strain_type === 'sativa')
        .sort((a, b) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (lowerNeed.includes('pain')) {
      return availableProducts
        .filter(p => {
          const variant = p.variant;
          const hasPainTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile.caryophyllene > 0.15) ||
            (variant.terpene_profile.myrcene > 0.2) ||
            (variant.terpene_profile.pinene > 0.1)
          );
          const hasHighTHC = variant?.thc_percentage && variant.thc_percentage > 15;
          
          return hasPainTerpenes || hasHighTHC;
        })
        .sort((a, b) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (lowerNeed.includes('sleep') || lowerNeed.includes('insomnia')) {
      return availableProducts
        .filter(p => {
          const variant = p.variant;
          const hasSleepTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile.myrcene > 0.3) ||
            (variant.terpene_profile.linalool > 0.1)
          );
          const isIndica = p.strain_type === 'indica';
          
          return hasSleepTerpenes || isIndica;
        })
        .sort((a, b) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (lowerNeed.includes('energy') || lowerNeed.includes('focus')) {
      return availableProducts
        .filter(p => {
          const variant = p.variant;
          const hasEnergyTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile.limonene > 0.1) ||
            (variant.terpene_profile.pinene > 0.1) ||
            (variant.terpene_profile.terpinolene > 0.05)
          );
          const isSativa = p.strain_type === 'sativa';
          
          return hasEnergyTerpenes || isSativa;
        })
        .slice(0, 3);
    }
    
    // Default: return top 3 products with highest inventory
    return availableProducts
      .sort((a, b) => (b.variant?.inventory_level || 0) - (a.variant?.inventory_level || 0))
      .slice(0, 3);
  } catch (error) {
    console.error('Error analyzing inventory for need:', error);
    return [];
  }
}

/**
 * Generate product examples for a given query
 */
export async function getInventoryExamplesForQuery(query: string): Promise<{
  products: ProductWithVariant[];
  introText: string;
}> {
  try {
    const lowerQuery = query.toLowerCase();
    
    let introText = '';
    let products: ProductWithVariant[] = [];
    
    // Get fresh inventory data
    const { fetchProducts } = useProductsStore.getState();
    await fetchProducts();
    const allProducts = useProductsStore.getState().productsWithVariants;
    const availableProducts = allProducts.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    // Step 1: Check for specific product category requests
    if (lowerQuery.includes('gummies') || lowerQuery.includes('gummy')) {
      const gummyProducts = availableProducts.filter(p => 
        p.category === 'edible' && p.name.toLowerCase().includes('gumm')
      );
      
      if (gummyProducts.length > 0) {
        introText = "Here are the gummies we currently have in stock:";
        products = gummyProducts.slice(0, 5);
      } else {
        // Fallback to any edibles if no gummies found
        const edibleProducts = availableProducts.filter(p => p.category === 'edible');
        if (edibleProducts.length > 0) {
          introText = "We don't have gummies specifically in stock right now, but here are other edibles available:";
          products = edibleProducts.slice(0, 3);
        } else {
          introText = "Unfortunately, we don't have any gummies or edibles in stock at the moment.";
          products = [];
        }
      }
    }
    else if (lowerQuery.includes('edible') || lowerQuery.includes('chocolate') || lowerQuery.includes('candy')) {
      const edibleProducts = availableProducts.filter(p => p.category === 'edible');
      if (edibleProducts.length > 0) {
        introText = "Here are our edibles currently in stock:";
        products = edibleProducts.slice(0, 5);
      } else {
        introText = "We don't have any edibles in stock at the moment.";
        products = [];
      }
    }
    else if (lowerQuery.includes('flower') || lowerQuery.includes('bud') || lowerQuery.includes('pre-roll')) {
      const flowerProducts = availableProducts.filter(p => 
        p.category === 'flower' || p.category === 'pre-roll'
      );
      if (flowerProducts.length > 0) {
        introText = "Here are our flower products currently in stock:";
        products = flowerProducts.slice(0, 5);
      } else {
        introText = "We don't have any flower products in stock at the moment.";
        products = [];
      }
    }
    else if (lowerQuery.includes('vape') || lowerQuery.includes('cartridge') || lowerQuery.includes('cart') || lowerQuery.includes('pen')) {
      const vapeProducts = availableProducts.filter(p => 
        p.category === 'vaporizer' || p.category === 'cartridge'
      );
      if (vapeProducts.length > 0) {
        introText = "Here are our vape products currently in stock:";
        products = vapeProducts.slice(0, 5);
      } else {
        introText = "We don't have any vape products in stock at the moment.";
        products = [];
      }
    }
    else if (lowerQuery.includes('concentrate') || lowerQuery.includes('wax') || lowerQuery.includes('shatter') || lowerQuery.includes('resin')) {
      const concentrateProducts = availableProducts.filter(p => p.category === 'concentrate');
      if (concentrateProducts.length > 0) {
        introText = "Here are our concentrates currently in stock:";
        products = concentrateProducts.slice(0, 5);
      } else {
        introText = "We don't have any concentrates in stock at the moment.";
        products = [];
      }
    }
    // Step 2: Check for terpene-related queries
    else if (lowerQuery.includes('terpene') || lowerQuery.includes('terp')) {
      introText = "Here are some products from our inventory with notable terpene profiles:";
      products = await analyzeInventoryForNeed('terpenes');
    } 
    // Step 3: Check for strain type queries
    else if (lowerQuery.includes('indica')) {
      introText = "Here are some indica strains currently in our inventory:";
      products = await analyzeInventoryForNeed('indica');
    }
    else if (lowerQuery.includes('sativa')) {
      introText = "Here are some sativa strains currently in our inventory:";
      products = await analyzeInventoryForNeed('sativa');
    }
    else if (lowerQuery.includes('hybrid')) {
      introText = "Here are some balanced hybrid strains we currently carry:";
      products = availableProducts
        .filter(p => p.strain_type === 'hybrid')
        .sort((a, b) => (b.variant.inventory_level || 0) - (a.variant.inventory_level || 0))
        .slice(0, 3);
    }
    // Step 4: Check for effect/need queries
    else if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia')) {
      introText = "Here are some products that may help with sleep:";
      products = await analyzeInventoryForNeed('sleep');
    }
    else if (lowerQuery.includes('pain') || lowerQuery.includes('relief')) {
      introText = "Here are some products that customers often choose for pain relief:";
      products = await analyzeInventoryForNeed('pain');
    }
    else if (lowerQuery.includes('anxiety') || lowerQuery.includes('stress')) {
      introText = "Here are some products that might help with anxiety or stress:";
      products = await analyzeInventoryForNeed('anxiety');
    }
    else if (lowerQuery.includes('energy') || lowerQuery.includes('focus')) {
      introText = "Here are some energizing products from our inventory:";
      products = await analyzeInventoryForNeed('energy');
    }
    // Step 5: Default case - use findRelevantProductsForQuery
    else if (shouldUseInventoryRAG(query)) {
      products = await findRelevantProductsForQuery(query, availableProducts);
      if (products.length > 0) {
        introText = "Here are some products from our current inventory that might be relevant:";
      } else {
        // If no specific matches, show a sample of popular products
        introText = "Here's a sample of what we have in stock:";
        products = availableProducts
          .sort((a, b) => (b.variant.inventory_level || 0) - (a.variant.inventory_level || 0))
          .slice(0, 3);
      }
    }
    
    return {
      products,
      introText
    };
    
  } catch (error) {
    console.error('Error getting inventory examples:', error);
    return {
      products: [],
      introText: ''
    };
  }
}