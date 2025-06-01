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
 */
export function shouldUseInventoryRAG(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Cannabis product-related keywords
  const productKeywords = [
    'strain', 'strains', 'product', 'products', 'flower', 'bud', 'buds',
    'edible', 'edibles', 'gummies', 'chocolate', 'vape', 'vapes', 'cartridge',
    'concentrate', 'concentrates', 'wax', 'shatter', 'rosin', 'hash',
    'tincture', 'tinctures', 'topical', 'topicals', 'pre-roll', 'preroll',
    'joint', 'joints', 'brand', 'brands'
  ];
  
  // Effect-related keywords that might benefit from product examples
  const effectKeywords = [
    'anxiety', 'stress', 'pain', 'sleep', 'insomnia', 'energy', 'focus',
    'creative', 'creativity', 'relaxing', 'uplifting', 'euphoric', 'calm',
    'appetite', 'nausea', 'inflammation', 'depression', 'mood'
  ];
  
  // Cannabis science keywords that benefit from real examples
  const scienceKeywords = [
    'terpene', 'terpenes', 'terps', 'myrcene', 'limonene', 'pinene', 'linalool',
    'caryophyllene', 'humulene', 'terpinolene', 'ocimene', 'bisabolol',
    'thc', 'cbd', 'cbg', 'cbn', 'cannabinoid', 'cannabinoids',
    'indica', 'sativa', 'hybrid', 'potency', 'percentage'
  ];
  
  // Consumption method keywords
  const consumptionKeywords = [
    'smoke', 'smoking', 'vaping', 'vaporize', 'dab', 'dabbing', 'eat', 'eating',
    'sublingual', 'topical', 'dose', 'dosing', 'dosage', 'microdose'
  ];
  
  // Questions that ask for recommendations or comparisons
  const recommendationKeywords = [
    'recommend', 'suggestion', 'suggest', 'best', 'good for', 'help with',
    'which', 'what should', 'compare', 'difference between', 'better',
    'stronger', 'milder', 'similar to'
  ];
  
  // Check if query contains any relevant keywords
  const allKeywords = [
    ...productKeywords,
    ...effectKeywords, 
    ...scienceKeywords,
    ...consumptionKeywords,
    ...recommendationKeywords
  ];
  
  return allKeywords.some(keyword => lowerQuery.includes(keyword));
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
    const edibleProducts = availableProducts.filter(p => p.category === 'edibles');
    relevantProducts = [...relevantProducts, ...edibleProducts.slice(0, 3)];
  }
  
  if (lowerQuery.includes('vape') || lowerQuery.includes('cartridge') || lowerQuery.includes('pen')) {
    const vapeProducts = availableProducts.filter(p => p.category === 'vaporizers');
    relevantProducts = [...relevantProducts, ...vapeProducts.slice(0, 3)];
  }
  
  if (lowerQuery.includes('concentrate') || lowerQuery.includes('wax') || lowerQuery.includes('shatter')) {
    const concentrateProducts = availableProducts.filter(p => p.category === 'concentrates');
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
      .filter(p => (p.thc_percentage || 0) > 25)
      .sort((a, b) => (b.thc_percentage || 0) - (a.thc_percentage || 0));
    relevantProducts = [...relevantProducts, ...highThcProducts.slice(0, 2)];
  }
  
  if (lowerQuery.includes('low thc') || lowerQuery.includes('mild') || lowerQuery.includes('cbd')) {
    const lowThcProducts = availableProducts
      .filter(p => (p.thc_percentage || 0) < 20 || (p.cbd_percentage || 0) > 5)
      .sort((a, b) => (a.thc_percentage || 0) - (b.thc_percentage || 0));
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
      summary += `${index + 1}. ${product.name} by ${product.brand} (${product.strain_type}, ${product.thc_percentage?.toFixed(1)}% THC, $${product.price})`;
      
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
 * Search for products related to a specific topic (for educational responses)
 * Uses the same data source as the admin inventory page
 */
export async function findProductsByTopic(
  topic: string, 
  organizationId: string,
  limit: number = 5
): Promise<ProductWithVariant[]> {
  const { fetchProducts } = useProductsStore.getState();
  
  try {
    // Ensure we have fresh data
    await fetchProducts();
    
    // Get the current products from the store
    const allProducts = useProductsStore.getState().productsWithVariants;
    
    // Filter for available products with inventory
    const availableProducts = allProducts.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    // Define topic-to-search mappings
    const topicSearchMap: Record<string, string[]> = {
      'terpenes': ['terpene', 'terp', 'myrcene', 'limonene', 'pinene', 'linalool'],
      'indica': ['indica'],
      'sativa': ['sativa'],
      'hybrid': ['hybrid'],
      'thc': ['high thc', 'potent', 'strong'],
      'cbd': ['cbd'],
      'edibles': ['gummies', 'edible', 'candy', 'chocolate'],
      'concentrates': ['concentrate', 'wax', 'shatter', 'rosin', 'live resin'],
      'flower': ['flower', 'bud'],
      'vapes': ['vape', 'cartridge', 'pen', 'disposable'],
      'anxiety': ['calm', 'relaxing', 'stress'],
      'pain': ['pain', 'relief', 'inflammation'],
      'sleep': ['sleep', 'insomnia', 'nighttime']
    };
    
    const searchTerms = topicSearchMap[topic.toLowerCase()] || [topic];
    let matchedProducts: ProductWithVariant[] = [];
    
    // Search for products that match the topic
    for (const term of searchTerms) {
      const termLower = term.toLowerCase();
      const matches = availableProducts.filter(product => 
        product.name.toLowerCase().includes(termLower) ||
        product.brand.toLowerCase().includes(termLower) ||
        product.category.toLowerCase().includes(termLower) ||
        product.strain_type?.toLowerCase().includes(termLower) ||
        product.description?.toLowerCase().includes(termLower) ||
        // Check terpene profiles
        (product.variant.terpene_profile && 
         Object.keys(product.variant.terpene_profile).some(terpene => 
           terpene.toLowerCase().includes(termLower)
         ))
      );
      matchedProducts = [...matchedProducts, ...matches];
    }
    
    // Remove duplicates and limit results
    const uniqueResults = matchedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueResults.slice(0, limit);
  } catch (error) {
    console.error('Error finding products by topic:', error);
    return [];
  }
}

/**
 * Get products with specific characteristics for educational examples
 * Uses the same data source as the admin inventory page
 */
export async function getProductExamples(
  organizationId: string,
  criteria: {
    strainType?: 'indica' | 'sativa' | 'hybrid';
    category?: string;
    highTHC?: boolean;
    highCBD?: boolean;
    terpeneRich?: boolean;
  }
): Promise<ProductWithVariant[]> {
  const { fetchProducts } = useProductsStore.getState();
  
  try {
    // Ensure we have fresh data
    await fetchProducts();
    
    // Get the current products from the store
    const allProducts = useProductsStore.getState().productsWithVariants;
    
    // Filter for available products with inventory
    let filtered = allProducts.filter(p => 
      p.variant.is_available && p.variant.inventory_level > 0
    );
    
    if (criteria.strainType) {
      filtered = filtered.filter(p => p.strain_type === criteria.strainType);
    }
    
    if (criteria.category) {
      filtered = filtered.filter(p => p.category === criteria.category);
    }
    
    if (criteria.highTHC) {
      filtered = filtered.filter(p => (p.thc_percentage || 0) > 20);
    }
    
    if (criteria.highCBD) {
      filtered = filtered.filter(p => (p.cbd_percentage || 0) > 5);
    }
    
    if (criteria.terpeneRich) {
      filtered = filtered.filter(p => 
        p.variant.terpene_profile && 
        Object.keys(p.variant.terpene_profile).length > 0
      );
    }
    
    // Return up to 3 examples
    return filtered.slice(0, 3);
  } catch (error) {
    console.error('Error getting product examples:', error);
    return [];
  }
}

/**
 * Generate contextual inventory information for Bud's responses
 * Uses the same data source as the admin inventory page
 */
export async function generateInventoryInsight(
  topic: string,
  organizationId: string
): Promise<string> {
  try {
    const context = await getInventoryContext(organizationId);
    const relatedProducts = await findProductsByTopic(topic, organizationId, 3);
    
    if (context.totalProducts === 0) {
      return "I don't have access to current inventory right now, but I can still help with general cannabis education!";
    }
    
    let insight = `We currently have ${context.totalProducts} products available. `;
    
    if (relatedProducts.length > 0) {
      const productNames = relatedProducts.slice(0, 2).map(p => `${p.name} by ${p.brand}`);
      insight += `For ${topic}, you might be interested in products like ${productNames.join(' or ')}. `;
    }
    
    // Add relevant inventory stats based on topic
    if (topic.toLowerCase().includes('thc') && context.thcRange.max > 0) {
      insight += `Our THC levels range from ${context.thcRange.min.toFixed(1)}% to ${context.thcRange.max.toFixed(1)}%. `;
    }
    
    if (topic.toLowerCase().includes('strain') || topic.toLowerCase().includes('indica') || topic.toLowerCase().includes('sativa')) {
      const strainCounts = context.strainTypes.map(type => 
        `${context.availableProducts.filter(p => p.strain_type === type).length} ${type}`
      );
      insight += `We have ${strainCounts.join(', ')} products available. `;
    }
    
    return insight.trim();
  } catch (error) {
    console.error('Error generating inventory insight:', error);
    return "I can help you learn about cannabis! Feel free to ask any questions.";
  }
}