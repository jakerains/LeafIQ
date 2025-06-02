#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert True North markdown inventory files to JSON format for admin import
 */

// Your organization ID (replace with your actual org ID)
const ORGANIZATION_ID = 'd85af8c9-0d4a-451c-bc25-8c669c71142e'; // Demo Dispensary organization ID

// Directory containing the markdown files
const MARKDOWN_DIR = path.join(__dirname, '..', 'truenorthdemodata');
const OUTPUT_DIR = path.join(__dirname, '..', 'truenorthdemodata', 'json-output');

/**
 * Parse a markdown inventory file and convert to JSON
 */
function parseMarkdownToJSON(markdownContent, filename) {
  const lines = markdownContent.split('\n');
  const products = [];
  
  let currentProduct = null;
  let productCounter = 1;
  
  // Determine category from filename
  const category = detectCategoryFromFilename(filename);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines, dividers, and headers
    if (!line || line.startsWith('---') || 
        (line.startsWith('#') && !line.startsWith('#### '))) {
      continue;
    }
    
    // Skip metadata lines (but not product detail lines)
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
      
      // Start new product - clean the name of emojis and special markers
      const productName = line
        .replace('#### ', '')
        .replace(/⭐.*$/, '')
        .replace(/💸.*$/, '')
        .trim();
      
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
    
    // Product details (- **Field:** Value format)
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
            currentProduct.thc = parsePercentage(value);
            break;
          case 'cbd':
            currentProduct.cbd = parsePercentage(value);
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
    
    // Simple product format (no bullets) - alternative format handling
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
      if (thcMatch) currentProduct.thc = parsePercentage(thcMatch[1]);
    }
    
    if (line.includes('**CBD:**') && currentProduct) {
      const cbdMatch = line.match(/\*\*CBD:\*\* ([^*]+)/);
      if (cbdMatch) currentProduct.cbd = parsePercentage(cbdMatch[1]);
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
  
  // Add the last product
  if (currentProduct) {
    const importProduct = convertToImportProduct(currentProduct, productCounter++, category);
    if (importProduct) {
      products.push(importProduct);
    }
  }
  
  return {
    metadata: {
      format_version: '1.0',
      organization_id: ORGANIZATION_ID,
      timestamp: new Date().toISOString(),
      source_file: filename,
      total_products: products.length
    },
    products
  };
}

/**
 * Convert parsed product to import format
 */
function convertToImportProduct(parsed, counter, category) {
  if (!parsed.name || !parsed.brand) {
    console.warn(`Skipping product ${counter}: missing name or brand`);
    return null;
  }
  
  // Generate unique IDs
  const productId = `truenorth-${category}-${counter.toString().padStart(3, '0')}`;
  
  // Parse strain type
  const strainType = parseStrainType(parsed.type);
  
  // Parse variants from pricing
  let variants = parsePricingToVariants(parsed.pricing, productId, parsed.thc, parsed.cbd);
  
  if (variants.length === 0) {
    // Create a single variant if no pricing found
    let sizeWeight = '1g'; // Default
    
    // Look for size in the parsed data
    if (parsed.size) {
      sizeWeight = parsed.size;
    } else if (category === 'edible') {
      sizeWeight = '1pk';
    } else if (category === 'pre_rolls') {
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
      id: `${productId}-var1`,
      size_weight: sizeWeight,
      price: price,
      original_price: price,
      thc_percentage: parsed.thc || 0,
      cbd_percentage: parsed.cbd || 0,
      total_cannabinoids: (parsed.thc || 0) + (parsed.cbd || 0),
      inventory_level: Math.floor(Math.random() * 20) + 5, // Random inventory 5-25
      is_available: true,
      terpene_profile: generateRandomTerpeneProfile(strainType)
    });
  } else {
    // Add terpene profiles to existing variants
    variants = variants.map(variant => ({
      ...variant,
      terpene_profile: generateRandomTerpeneProfile(strainType)
    }));
  }
  
  return {
    id: productId,
    name: parsed.name,
    brand: parsed.brand,
    category,
    subcategory: parseSubcategory(parsed.name, category) || undefined,
    description: generateDescription(parsed),
    image_url: parsed.imageUrl,
    strain_type: strainType,
    variants
  };
}

/**
 * Generate a description for the product
 */
function generateDescription(parsed) {
  let desc = '';
  
  if (parsed.type) {
    desc += `${parsed.type} `;
  }
  
  if (parsed.thc) {
    desc += `with ${parsed.thc}% THC`;
  }
  
  if (parsed.cbd && parsed.cbd > 0) {
    desc += ` and ${parsed.cbd}% CBD`;
  }
  
  return desc.trim() || `Quality ${parsed.category} product from ${parsed.brand}`;
}

/**
 * Parse percentage values from strings
 */
function parsePercentage(str) {
  if (!str) return 0;
  const match = str.match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Parse strain type from type string
 */
function parseStrainType(type) {
  if (!type) return 'hybrid';
  
  const lowerType = type.toLowerCase();
  if (lowerType.includes('indica')) return 'indica';
  if (lowerType.includes('sativa')) return 'sativa';
  if (lowerType.includes('hybrid')) return 'hybrid';
  if (lowerType.includes('cbd')) return 'cbd';
  
  return 'hybrid'; // Default
}

/**
 * Parse subcategory from product name and category
 */
function parseSubcategory(name, category) {
  const lowerName = name.toLowerCase();
  
  switch (category) {
    case 'flower':
      if (lowerName.includes('indoor')) return 'indoor';
      if (lowerName.includes('outdoor')) return 'outdoor';
      if (lowerName.includes('greenhouse')) return 'greenhouse';
      return 'premium';
      
    case 'edible':
      if (lowerName.includes('gummies') || lowerName.includes('gummy')) return 'gummies';
      if (lowerName.includes('chocolate')) return 'chocolate';
      if (lowerName.includes('beverage') || lowerName.includes('drink')) return 'beverages';
      if (lowerName.includes('lollipop') || lowerName.includes('lolli')) return 'lollipops';
      return 'gummies';
      
    case 'concentrate':
      if (lowerName.includes('rosin')) return 'rosin';
      if (lowerName.includes('shatter')) return 'shatter';
      if (lowerName.includes('wax')) return 'wax';
      return 'extract';
      
    case 'vaporizer':
      if (lowerName.includes('cart')) return 'cartridge';
      if (lowerName.includes('disposable')) return 'disposable';
      return 'cartridge';
      
    default:
      return null;
  }
}

/**
 * Parse pricing string into variants
 */
function parsePricingToVariants(pricing, productId, thc, cbd) {
  if (!pricing) return [];
  
  const variants = [];
  let variantCounter = 1;
  
  // Common pricing patterns: $25/3.5g, $30/4.2g, etc.
  const priceMatches = pricing.match(/\$([0-9.]+)\/([0-9.]+[a-zA-Z]+)/g);
  
  if (priceMatches) {
    priceMatches.forEach(match => {
      const parts = match.split('/');
      const price = parseFloat(parts[0].replace('$', ''));
      const size = parts[1];
      
      variants.push({
        id: `${productId}-var${variantCounter++}`,
        size_weight: size,
        price: price,
        original_price: price,
        thc_percentage: thc || 0,
        cbd_percentage: cbd || 0,
        total_cannabinoids: (thc || 0) + (cbd || 0),
        inventory_level: Math.floor(Math.random() * 20) + 5,
        is_available: true
      });
    });
  }
  
  return variants;
}

/**
 * Generate random terpene profile based on strain type
 */
function generateRandomTerpeneProfile(strainType) {
  const baseProfile = {
    myrcene: 0,
    limonene: 0,
    pinene: 0,
    caryophyllene: 0,
    linalool: 0,
    humulene: 0,
    terpinolene: 0,
    ocimene: 0
  };
  
  // Different terpene tendencies based on strain type
  switch (strainType) {
    case 'indica':
      baseProfile.myrcene = Math.random() * 1.5 + 0.3; // 0.3-1.8
      baseProfile.caryophyllene = Math.random() * 0.8 + 0.1;
      baseProfile.linalool = Math.random() * 0.5 + 0.05;
      break;
      
    case 'sativa':
      baseProfile.limonene = Math.random() * 1.2 + 0.2; // 0.2-1.4
      baseProfile.pinene = Math.random() * 0.9 + 0.1;
      baseProfile.terpinolene = Math.random() * 0.3 + 0.02;
      break;
      
    case 'hybrid':
      baseProfile.myrcene = Math.random() * 1.0 + 0.2;
      baseProfile.limonene = Math.random() * 0.8 + 0.1;
      baseProfile.pinene = Math.random() * 0.6 + 0.1;
      baseProfile.caryophyllene = Math.random() * 0.5 + 0.1;
      break;
      
    default:
      baseProfile.myrcene = Math.random() * 0.8 + 0.2;
      baseProfile.limonene = Math.random() * 0.6 + 0.1;
      break;
  }
  
  // Add some randomness to other terpenes
  baseProfile.humulene = Math.random() * 0.3 + 0.01;
  baseProfile.ocimene = Math.random() * 0.2 + 0.01;
  
  // Round to 2 decimal places
  Object.keys(baseProfile).forEach(key => {
    baseProfile[key] = Math.round(baseProfile[key] * 100) / 100;
  });
  
  return baseProfile;
}

/**
 * Detect category from filename
 */
function detectCategoryFromFilename(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('flower')) return 'flower';
  if (lowerFilename.includes('edible')) return 'edible';
  if (lowerFilename.includes('concentrate')) return 'concentrate';
  if (lowerFilename.includes('vaporizer')) return 'vaporizer';
  if (lowerFilename.includes('preroll')) return 'pre_rolls';
  if (lowerFilename.includes('tincture')) return 'tincture';
  
  return 'flower'; // Default fallback
}

/**
 * Main conversion function
 */
async function convertAllMarkdownFiles() {
  console.log('🔄 Converting True North markdown files to JSON...\n');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}\n`);
  }
  
  // Read all markdown files
  const files = fs.readdirSync(MARKDOWN_DIR)
    .filter(file => file.endsWith('.md'))
    .filter(file => file.startsWith('true_north_'));
  
  if (files.length === 0) {
    console.log('❌ No True North markdown files found in', MARKDOWN_DIR);
    return;
  }
  
  console.log(`📄 Found ${files.length} markdown files:`);
  files.forEach(file => console.log(`   • ${file}`));
  console.log('');
  
  let totalProducts = 0;
  const allProducts = [];
  
  // Process each file
  for (const file of files) {
    const filePath = path.join(MARKDOWN_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`🔄 Processing ${file}...`);
    
    const jsonData = parseMarkdownToJSON(content, file);
    
    // Write individual JSON file
    const outputFilename = file.replace('.md', '.json');
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    
    console.log(`   ✅ Generated ${outputFilename} (${jsonData.products.length} products)`);
    
    totalProducts += jsonData.products.length;
    allProducts.push(...jsonData.products);
  }
  
  // Create combined file
  const combinedData = {
    metadata: {
      format_version: '1.0',
      organization_id: ORGANIZATION_ID,
      timestamp: new Date().toISOString(),
      source: 'True North Dispensary Complete Inventory',
      total_products: totalProducts,
      categories_included: [...new Set(allProducts.map(p => p.category))]
    },
    products: allProducts
  };
  
  const combinedPath = path.join(OUTPUT_DIR, 'true_north_complete_inventory.json');
  fs.writeFileSync(combinedPath, JSON.stringify(combinedData, null, 2));
  
  console.log(`\n🎉 Conversion complete!`);
  console.log(`   📊 Total products converted: ${totalProducts}`);
  console.log(`   📁 Individual files: ${files.length}`);
  console.log(`   📄 Combined file: true_north_complete_inventory.json`);
  console.log(`   📂 Output directory: ${OUTPUT_DIR}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Open the LeafIQ admin panel`);
  console.log(`   2. Go to Import/Export > JSON Import`);
  console.log(`   3. Upload one of the generated JSON files`);
  console.log(`   4. Choose "Update Inventory" or "Replace Inventory" mode`);
  console.log(`   5. Import your products! 🚀`);
}

// Update organization ID reminder
console.log('⚠️  IMPORTANT: Update ORGANIZATION_ID at the top of this script!');
console.log(`   Current value: "${ORGANIZATION_ID}"`);
console.log('   Replace with your actual organization ID from LeafIQ\n');

// Run the conversion
convertAllMarkdownFiles().catch(console.error); 