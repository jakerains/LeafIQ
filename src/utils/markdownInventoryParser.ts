import { ImportData, ImportProduct, ImportVariant } from './inventoryImporter';

interface ParsedProduct {
  name: string;
  brand: string;
  type: string;
  thc?: number;
  cbd?: number;
  pricing: string;
  size?: string;
  imageUrl?: string;
  category: string;
  subcategory?: string;
}

/**
 * Parse True North markdown files into import-ready JSON
 */
export function parseMarkdownToImportData(
  markdownContent: string,
  organizationId: string,
  categoryOverride?: string
): ImportData {
  const lines = markdownContent.split('\n');
  const products: ImportProduct[] = [];
  
  let currentProduct: ParsedProduct | null = null;
  let productCounter = 1;
  
  // Determine category from content or override
  const category = categoryOverride || detectCategoryFromContent(markdownContent);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and dividers
    if (!line || line.startsWith('---')) {
      continue;
    }
    
    // Skip headers that are not product names
    if (line.startsWith('#') && !line.startsWith('#### ')) {
      continue;
    }
    
    // Skip metadata lines
    if (line.startsWith('**') && !line.startsWith('- **')) {
      continue;
    }
    
    // Product name detection (#### heading)
    if (line.startsWith('#### ')) {
      // Save previous product if exists
      if (currentProduct) {
        const importProduct = convertToImportProduct(currentProduct, productCounter++, category);
        if (importProduct) {
          products.push(importProduct);
        }
      }
      
      // Start new product
      const productName = line.replace('#### ', '').replace(/⭐.*$/, '').replace(/💸.*$/, '').trim();
      currentProduct = {
        name: productName,
        brand: '',
        type: '',
        pricing: '',
        category,
      };
      
      // Check next line for image
      if (i + 1 < lines.length && lines[i + 1].startsWith('![')) {
        const imageLine = lines[i + 1];
        const imageMatch = imageLine.match(/\((https?:\/\/[^)]+)\)/);
        if (imageMatch) {
          currentProduct.imageUrl = imageMatch[1];
        }
        i++; // Skip the image line
      }
    }
    
    // Product details (- **Field:** Value)
    if (line.startsWith('- **') && currentProduct) {
      const fieldMatch = line.match(/- \*\*([^:]+):\*\* (.+)/);
      if (fieldMatch) {
        const field = fieldMatch[1].toLowerCase();
        const value = fieldMatch[2];
        
        switch (field) {
          case 'brand':
            currentProduct.brand = value;
            break;
          case 'type':
            currentProduct.type = value;
            break;
          case 'thc':
            currentProduct.thc = parseFloat(value.replace(/[^0-9.]/g, ''));
            break;
          case 'cbd':
            currentProduct.cbd = parseFloat(value.replace(/[^0-9.]/g, ''));
            break;
          case 'size':
            currentProduct.size = value;
            break;
          case 'pricing':
          case 'price':
            currentProduct.pricing = value;
            break;
        }
      }
    }
    
    // Simple product format (no bullets)
    if (line.includes('**Brand:**') && currentProduct) {
      const brandMatch = line.match(/\*\*Brand:\*\* ([^*]+)/);
      if (brandMatch) currentProduct.brand = brandMatch[1].trim();
    }
    
    if (line.includes('**Type:**') && currentProduct) {
      const typeMatch = line.match(/\*\*Type:\*\* ([^*]+)/);
      if (typeMatch) currentProduct.type = typeMatch[1].trim();
    }
    
    if (line.includes('**THC:**') && currentProduct) {
      const thcMatch = line.match(/\*\*THC:\*\* ([^*]+)/);
      if (thcMatch) currentProduct.thc = parseFloat(thcMatch[1].replace(/[^0-9.]/g, ''));
    }
    
    if (line.includes('**CBD:**') && currentProduct) {
      const cbdMatch = line.match(/\*\*CBD:\*\* ([^*]+)/);
      if (cbdMatch) currentProduct.cbd = parseFloat(cbdMatch[1].replace(/[^0-9.]/g, ''));
    }
    
    if (line.includes('**Size:**') && currentProduct) {
      const sizeMatch = line.match(/\*\*Size:\*\* ([^*]+)/);
      if (sizeMatch) currentProduct.size = sizeMatch[1].trim();
    }
    
    if (line.includes('**Price:**') && currentProduct) {
      const priceMatch = line.match(/\*\*Price:\*\* ([^*]+)/);
      if (priceMatch) currentProduct.pricing = priceMatch[1].trim();
    }
    
    if (line.includes('**Pricing:**') && currentProduct) {
      const pricingMatch = line.match(/\*\*Pricing:\*\* ([^*]+)/);
      if (pricingMatch) currentProduct.pricing = pricingMatch[1].trim();
    }
  }
  
  // Don't forget the last product
  if (currentProduct) {
    const importProduct = convertToImportProduct(currentProduct, productCounter++, category);
    if (importProduct) {
      products.push(importProduct);
    }
  }
  
  return {
    metadata: {
      format_version: '1.0',
      organization_id: organizationId,
      timestamp: new Date().toISOString()
    },
    products
  };
}

/**
 * Detect category from markdown content
 */
function detectCategoryFromContent(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('flower') || lowerContent.includes('strain')) {
    return 'flower';
  } else if (lowerContent.includes('edible') || lowerContent.includes('gummies') || lowerContent.includes('chocolate')) {
    return 'edible';
  } else if (lowerContent.includes('concentrate') || lowerContent.includes('rosin') || lowerContent.includes('shatter')) {
    return 'concentrate';
  } else if (lowerContent.includes('vaporizer') || lowerContent.includes('cartridge') || lowerContent.includes('vape')) {
    return 'vaporizer';
  } else if (lowerContent.includes('preroll') || lowerContent.includes('pre-roll') || lowerContent.includes('joint')) {
    return 'pre_rolls';
  } else if (lowerContent.includes('tincture') || lowerContent.includes('oil')) {
    return 'tincture';
  }
  
  return 'flower'; // Default fallback
}

/**
 * Convert parsed product to import format
 */
function convertToImportProduct(
  parsed: ParsedProduct, 
  counter: number, 
  category: string
): ImportProduct | null {
  if (!parsed.name || !parsed.brand) {
    return null;
  }
  
  // Generate UUID for product
  const productId = crypto.randomUUID();
  
  // Parse strain type
  const strainType = parseStrainType(parsed.type);
  
  // Parse variants from pricing
  let variants = parsePricingToVariants(parsed.pricing, parsed.thc, parsed.cbd);
  
  if (variants.length === 0) {
    // Create a single variant if no pricing found
    // Try to extract size from the parsed data
    let sizeWeight = '1g'; // Default
    
    // Look for size in the parsed data
    if (parsed.size) {
      sizeWeight = parsed.size;
    } else if (category === 'edible') {
      sizeWeight = '1pk';
    }
    
    // Extract price from pricing string if available
    let price = 25.00; // Default
    if (parsed.pricing) {
      const priceMatch = parsed.pricing.match(/\$([0-9.]+)/);
      if (priceMatch) {
        price = parseFloat(priceMatch[1]);
      }
    }
    
    variants.push({
      id: crypto.randomUUID(),
      size_weight: sizeWeight,
      price: price,
      original_price: price,
      thc_percentage: parsed.thc || 0,
      cbd_percentage: parsed.cbd || 0,
      inventory_level: Math.floor(Math.random() * 20) + 5, // Random inventory 5-25
      is_available: true,
      terpene_profile: {}
    });
  }
  
  return {
    id: productId,
    name: parsed.name,
    brand: parsed.brand,
    category,
    subcategory: parseSubcategory(parsed.name, category) || undefined,
    description: `${parsed.type} strain with ${parsed.thc || 0}% THC`,
    image_url: parsed.imageUrl,
    strain_type: strainType,
    variants
  };
}

/**
 * Parse strain type from type string
 */
function parseStrainType(type: string): 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced' {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('indica')) return 'indica';
  if (lowerType.includes('sativa')) return 'sativa';
  if (lowerType.includes('hybrid')) return 'hybrid';
  if (lowerType.includes('cbd')) return 'cbd';
  if (lowerType.includes('balanced')) return 'balanced';
  
  return 'hybrid'; // Default
}

/**
 * Parse subcategory from product name and category
 */
function parseSubcategory(name: string, category: string): string | null {
  const lowerName = name.toLowerCase();
  
  if (category === 'edible') {
    if (lowerName.includes('gummies') || lowerName.includes('gummy')) return 'gummies';
    if (lowerName.includes('chocolate')) return 'chocolate';
    if (lowerName.includes('cookie')) return 'cookies';
    if (lowerName.includes('brownie')) return 'brownies';
    if (lowerName.includes('lollipop') || lowerName.includes('lolli')) return 'lollipops';
  } else if (category === 'concentrate') {
    if (lowerName.includes('rosin')) return 'live_rosin';
    if (lowerName.includes('shatter')) return 'shatter';
    if (lowerName.includes('badder')) return 'badder';
    if (lowerName.includes('wax')) return 'wax';
  } else if (category === 'vaporizer') {
    if (lowerName.includes('cartridge') || lowerName.includes('cart')) return 'cartridge';
    if (lowerName.includes('disposable')) return 'disposable';
  }
  
  return null;
}

/**
 * Parse pricing string into variants
 */
function parsePricingToVariants(
  pricing: string,
  thc?: number,
  cbd?: number
): ImportVariant[] {
  const variants: ImportVariant[] = [];
  
  if (!pricing) return variants;
  
  // Parse pricing like "$25/3.5g, $30/4.2g, $45/7g"
  const priceMatches = pricing.match(/\$([0-9.]+)\/([^,\s]+)/g);
  
  if (priceMatches) {
    priceMatches.forEach((match) => {
      const parts = match.split('/');
      const price = parseFloat(parts[0].replace('$', ''));
      const size = parts[1];
      
      variants.push({
        id: crypto.randomUUID(),
        size_weight: size,
        price,
        original_price: price,
        thc_percentage: thc || 0,
        cbd_percentage: cbd || 0,
        inventory_level: Math.floor(Math.random() * 20) + 5, // Random inventory 5-25
        is_available: true,
        terpene_profile: {}
      });
    });
  } else {
    // Try to parse single price like "$25.00"
    const singlePriceMatch = pricing.match(/\$([0-9.]+)/);
    if (singlePriceMatch) {
      const price = parseFloat(singlePriceMatch[1]);
      
      variants.push({
        id: crypto.randomUUID(),
        size_weight: detectSizeFromPrice(price),
        price,
        original_price: price,
        thc_percentage: thc || 0,
        cbd_percentage: cbd || 0,
        inventory_level: Math.floor(Math.random() * 20) + 5,
        is_available: true,
        terpene_profile: {}
      });
    }
  }
  
  return variants;
}

/**
 * Detect likely size from price point
 */
function detectSizeFromPrice(price: number): string {
  if (price <= 15) return '1g';
  if (price <= 30) return '3.5g';
  if (price <= 50) return '7g';
  if (price <= 100) return '14g';
  return '28g';
}

/**
 * Parse multiple markdown files and combine them
 */
export function parseMultipleMarkdownFiles(
  files: { name: string; content: string }[],
  organizationId: string
): ImportData {
  const allProducts: ImportProduct[] = [];
  
  files.forEach(file => {
    const category = detectCategoryFromFilename(file.name);
    const importData = parseMarkdownToImportData(file.content, organizationId, category);
    allProducts.push(...importData.products);
  });
  
  return {
    metadata: {
      format_version: '1.0',
      organization_id: organizationId,
      timestamp: new Date().toISOString()
    },
    products: allProducts
  };
}

/**
 * Detect category from filename
 */
function detectCategoryFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  
  if (lower.includes('flower')) return 'flower';
  if (lower.includes('edible')) return 'edible';
  if (lower.includes('concentrate')) return 'concentrate';
  if (lower.includes('vaporizer') || lower.includes('vape')) return 'vaporizer';
  if (lower.includes('preroll')) return 'pre_rolls';
  if (lower.includes('tincture')) return 'tincture';
  
  return 'flower';
}