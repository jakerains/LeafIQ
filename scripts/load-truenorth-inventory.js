import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto'; // Add import for UUID generation

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Demo organization ID (this is the fixed ID for the demo organization)
const DEMO_ORGANIZATION_ID = 'd85af8c9-0d4a-451c-bc25-8c669c71142e';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Parse multiple markdown files and combine them
 */
function parseMultipleMarkdownFiles(files, organizationId) {
  const allProducts = [];
  
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
 * Parse markdown to JSON format
 */
function parseMarkdownToImportData(markdownContent, organizationId, categoryOverride) {
  const products = [];
  const lines = markdownContent.split('\n');
  let currentProduct = null;
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
        thc: null,
        cbd: null,
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
    
    // Product details (- **Field:** etc.)
    else if (line.startsWith('- **') && currentProduct) {
      const detailMatch = line.match(/- \*\*([^:]+):\*\* (.+)/);
      if (detailMatch) {
        const key = detailMatch[1].toLowerCase();
        const value = detailMatch[2].trim();
        
        switch (key) {
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
          case 'price':
          case 'pricing':
            currentProduct.pricing = value;
            break;
        }
      }
    }
    
    // Simple product format (no bullets)
    else if (line.includes('**Brand:**') && currentProduct) {
      const brandMatch = line.match(/\*\*Brand:\*\* ([^*]+)/);
      if (brandMatch) currentProduct.brand = brandMatch[1].trim();
    }
    else if (line.includes('**Type:**') && currentProduct) {
      const typeMatch = line.match(/\*\*Type:\*\* ([^*]+)/);
      if (typeMatch) currentProduct.type = typeMatch[1].trim();
    }
    else if (line.includes('**THC:**') && currentProduct) {
      const thcMatch = line.match(/\*\*THC:\*\* ([^*]+)/);
      if (thcMatch) currentProduct.thc = parsePercentage(thcMatch[1]);
    }
    else if (line.includes('**CBD:**') && currentProduct) {
      const cbdMatch = line.match(/\*\*CBD:\*\* ([^*]+)/);
      if (cbdMatch) currentProduct.cbd = parsePercentage(cbdMatch[1]);
    }
    else if (line.includes('**Size:**') && currentProduct) {
      const sizeMatch = line.match(/\*\*Size:\*\* ([^*]+)/);
      if (sizeMatch) currentProduct.size = sizeMatch[1].trim();
    }
    else if (line.includes('**Price:**') && currentProduct) {
      const priceMatch = line.match(/\*\*Price:\*\* ([^*]+)/);
      if (priceMatch) currentProduct.pricing = priceMatch[1].trim();
    }
    else if (line.includes('**Pricing:**') && currentProduct) {
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
      organization_id: organizationId,
      timestamp: new Date().toISOString()
    },
    products
  };
}

/**
 * Detect category from markdown content
 */
function detectCategoryFromContent(content) {
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
function convertToImportProduct(parsed, counter, category) {
  if (!parsed.name || !parsed.brand) {
    return null;
  }
  
  // Generate proper UUID for product instead of string ID
  const productId = randomUUID();
  
  // Store a reference code for display/tracking purposes
  const productRefCode = `truenorth-${category}-${counter.toString().padStart(3, '0')}`;
  
  // Parse strain type
  const strainType = parseStrainType(parsed.type);
  
  // Parse variants from pricing
  let variants = parsePricingToVariants(parsed.pricing, productId, parsed.thc, parsed.cbd);
  
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
      id: randomUUID(), // Generate proper UUID for variant
      size_weight: sizeWeight,
      price: price,
      original_price: price,
      thc_percentage: parsed.thc || 0,
      cbd_percentage: parsed.cbd || 0,
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
    ref_code: productRefCode, // Store the original reference code for display purposes
    name: parsed.name,
    brand: parsed.brand,
    category,
    subcategory: parseSubcategory(parsed.name, category) || undefined,
    description: `${strainType.charAt(0).toUpperCase() + strainType.slice(1)} ${category.replace('_', ' ')} with ${parsed.thc || 0}% THC`,
    image_url: parsed.imageUrl || getDefaultImage(category, strainType),
    strain_type: strainType,
    variants
  };
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
  if (lowerType.includes('balanced')) return 'balanced';
  
  return 'hybrid'; // Default
}

/**
 * Parse subcategory from product name and category
 */
function parseSubcategory(name, category) {
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
function parsePricingToVariants(pricing, productId, thc, cbd) {
  const variants = [];
  
  if (!pricing) return variants;
  
  // Parse pricing like "$25/3.5g, $30/4.2g, $45/7g"
  const priceMatches = pricing.match(/\$([0-9.]+)\/([^,\s]+)/g);
  
  if (priceMatches) {
    priceMatches.forEach((match, index) => {
      const parts = match.split('/');
      const price = parseFloat(parts[0].replace('$', ''));
      const size = parts[1];
      
      variants.push({
        id: randomUUID(), // Generate proper UUID for variant
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
        id: randomUUID(), // Generate proper UUID for variant
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
function detectSizeFromPrice(price) {
  if (price <= 15) return '1g';
  if (price <= 30) return '3.5g';
  if (price <= 50) return '7g';
  if (price <= 100) return '14g';
  return '28g';
}

/**
 * Detect category from filename
 */
function detectCategoryFromFilename(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('flower')) return 'flower';
  if (lower.includes('edible')) return 'edible';
  if (lower.includes('concentrate')) return 'concentrate';
  if (lower.includes('vaporizer') || lower.includes('vape')) return 'vaporizer';
  if (lower.includes('preroll')) return 'pre_rolls';
  if (lower.includes('tincture')) return 'tincture';
  
  return 'flower';
}

/**
 * Parse percentage from string
 */
function parsePercentage(value) {
  if (!value) return 0;
  const match = value.toString().match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Generate random terpene profile based on strain type
 */
function generateRandomTerpeneProfile(strainType) {
  // Define terpene ranges based on strain type
  const terpeneRanges = {
    indica: {
      myrcene: [0.5, 1.2],
      limonene: [0.1, 0.6],
      pinene: [0.1, 0.4],
      caryophyllene: [0.3, 0.8],
      linalool: [0.2, 0.6],
      humulene: [0.1, 0.4],
      terpinolene: [0.05, 0.3],
      ocimene: [0.05, 0.2]
    },
    sativa: {
      myrcene: [0.2, 0.7],
      limonene: [0.4, 1.0],
      pinene: [0.3, 0.8],
      caryophyllene: [0.2, 0.6],
      terpinolene: [0.2, 0.7],
      ocimene: [0.1, 0.5],
      humulene: [0.1, 0.3],
      linalool: [0.05, 0.3]
    },
    hybrid: {
      myrcene: [0.3, 0.9],
      limonene: [0.2, 0.8],
      pinene: [0.2, 0.6],
      caryophyllene: [0.2, 0.7],
      linalool: [0.1, 0.4],
      humulene: [0.1, 0.4],
      terpinolene: [0.1, 0.4],
      ocimene: [0.05, 0.3]
    },
    cbd: {
      myrcene: [0.2, 0.6],
      limonene: [0.1, 0.4],
      pinene: [0.2, 0.7],
      caryophyllene: [0.3, 0.9],
      linalool: [0.1, 0.5],
      humulene: [0.2, 0.5],
      terpinolene: [0.05, 0.2],
      ocimene: [0.05, 0.2]
    }
  };
  
  // Use hybrid as fallback
  const ranges = terpeneRanges[strainType] || terpeneRanges.hybrid;
  
  // Generate random values within the defined ranges
  const profile = {};
  Object.entries(ranges).forEach(([terpene, [min, max]]) => {
    // Not all terpenes will be present in every strain
    if (Math.random() > 0.3) { // 70% chance of having each terpene
      profile[terpene] = parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
  });
  
  return profile;
}

/**
 * Get default image URL based on category and strain type
 */
function getDefaultImage(category, strainType) {
  // Placeholder image URLs - in a real app these would be actual image URLs
  const images = {
    flower: {
      indica: 'https://images.leafly.com/flower-images/indica/purple-afghani.png',
      sativa: 'https://images.leafly.com/flower-images/sativa/super-silver-haze.png',
      hybrid: 'https://images.leafly.com/flower-images/hybrid/blue-dream.png',
      cbd: 'https://images.leafly.com/flower-images/cbd/harlequin.png'
    },
    pre_rolls: 'https://images.leafly.com/product-images/pre-roll-joint.png',
    concentrate: 'https://images.leafly.com/product-images/concentrate-wax.png',
    vaporizer: 'https://images.leafly.com/product-images/vape-cartridge.png',
    edible: 'https://images.leafly.com/product-images/edible-gummy.png',
    tincture: 'https://images.leafly.com/product-images/tincture-bottle.png'
  };
  
  // Return specific image based on category and strain type if available
  if (category === 'flower' && images.flower[strainType]) {
    return images.flower[strainType];
  }
  
  // Return category image
  return images[category] || 'https://images.leafly.com/placeholder-product-image.png';
}

/**
 * Import inventory data to Supabase
 */
async function importInventoryData(importData, organizationId, mode = 'update') {
  const stats = {
    productsProcessed: 0,
    variantsProcessed: 0,
    productsCreated: 0,
    productsUpdated: 0,
    variantsCreated: 0,
    variantsUpdated: 0,
    errors: []
  };

  try {
    // If replacing existing, delete all current products for this organization
    if (mode === 'replace') {
      console.log(`🗑️ Removing existing products for organization: ${organizationId}`);
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('organization_id', organizationId);

      if (deleteError) {
        throw new Error(`Failed to clear existing inventory: ${deleteError.message}`);
      }
      console.log('✅ Existing products removed successfully');
    }

    // Process each product
    for (const importProduct of importData.products) {
      stats.productsProcessed++;

      try {
        // Call the RPC function to import the product
        const { data: productData, error: productError } = await supabase.rpc(
          'import_product_with_conflict_handling',
          {
            p_id: importProduct.id,
            p_organization_id: organizationId,
            p_name: importProduct.name,
            p_brand: importProduct.brand,
            p_category: importProduct.category,
            p_subcategory: importProduct.subcategory || null,
            p_description: importProduct.description || null,
            p_image_url: importProduct.image_url || null,
            p_strain_type: importProduct.strain_type || null
          }
        );

        if (productError) {
          stats.errors.push(`Failed to import product ${importProduct.name}: ${productError.message}`);
          continue;
        }

        // Check if product was created or updated
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, created_at, updated_at')
          .eq('id', importProduct.id)
          .single();

        if (existingProduct && new Date(existingProduct.created_at).getTime() === new Date(existingProduct.updated_at).getTime()) {
          stats.productsCreated++;
        } else {
          stats.productsUpdated++;
        }

        // Process variants for this product
        for (const importVariant of importProduct.variants) {
          stats.variantsProcessed++;

          try {
            // Call the RPC function to import the variant
            const { data: variantData, error: variantError } = await supabase.rpc(
              'import_variant_with_conflict_handling',
              {
                v_id: importVariant.id,
                v_product_id: importProduct.id,
                v_size_weight: importVariant.size_weight || null,
                v_price: importVariant.price || 0,
                v_original_price: importVariant.original_price || null,
                v_thc_percentage: importVariant.thc_percentage || null,
                v_cbd_percentage: importVariant.cbd_percentage || null,
                v_total_cannabinoids: importVariant.total_cannabinoids || null,
                v_inventory_level: importVariant.inventory_level || 0,
                v_is_available: typeof importVariant.is_available === 'boolean' ? importVariant.is_available : true,
                v_terpene_profile: importVariant.terpene_profile || {}
              }
            );

            if (variantError) {
              stats.errors.push(`Failed to import variant ${importVariant.id}: ${variantError.message}`);
              continue;
            }

            // Check if variant was created or updated
            const { data: existingVariant } = await supabase
              .from('variants')
              .select('id, created_at, updated_at')
              .eq('id', importVariant.id)
              .single();

            if (existingVariant && new Date(existingVariant.created_at).getTime() === new Date(existingVariant.updated_at).getTime()) {
              stats.variantsCreated++;
            } else {
              stats.variantsUpdated++;
            }

          } catch (variantError) {
            stats.errors.push(`Error processing variant ${importVariant.id}: ${variantError.message}`);
          }
        }
      } catch (productError) {
        stats.errors.push(`Error processing product ${importProduct.name}: ${productError.message}`);
      }
    }

    const hasErrors = stats.errors.length > 0;
    const message = hasErrors
      ? `Import completed with ${stats.errors.length} errors. ${stats.productsCreated + stats.productsUpdated} products and ${stats.variantsCreated + stats.variantsUpdated} variants processed.`
      : `Import successful! Created ${stats.productsCreated} products and ${stats.variantsCreated} variants. Updated ${stats.productsUpdated} products and ${stats.variantsUpdated} variants.`;

    return {
      success: !hasErrors || (stats.productsCreated + stats.productsUpdated > 0),
      message,
      stats
    };

  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error.message}`,
      stats
    };
  }
}

/**
 * Main function to load True North demo data
 */
async function loadTrueNorthInventory() {
  try {
    console.log('🌿 Starting True North Dispensary inventory import...');
    
    // Check if the truenorthdemodata directory exists
    const demoDataDir = path.join(__dirname, '..', 'truenorthdemodata');
    if (!fs.existsSync(demoDataDir)) {
      console.error(`❌ Error: Directory not found: ${demoDataDir}`);
      return;
    }
    
    // Read all markdown files from the directory
    console.log('📖 Reading markdown files from truenorthdemodata directory...');
    const files = fs.readdirSync(demoDataDir)
      .filter(file => file.endsWith('.md'))
      .map(filename => ({
        name: filename,
        content: fs.readFileSync(path.join(demoDataDir, filename), 'utf-8')
      }));
    
    console.log(`📄 Found ${files.length} markdown files to process`);
    
    // Parse the markdown files into a structured format
    console.log('🔍 Parsing markdown files into product data...');
    const importData = parseMultipleMarkdownFiles(files, DEMO_ORGANIZATION_ID);
    
    console.log(`✅ Parsed ${importData.products.length} products from markdown`);
    console.log('📊 Using proper UUIDs for product and variant IDs');
    
    // Import the data into Supabase
    console.log('📦 Importing products into Supabase...');
    console.log(`🎯 Target organization: ${DEMO_ORGANIZATION_ID}`);
    console.log('⚠️  Import mode: replace (will remove existing products)');
    
    const result = await importInventoryData(
      importData,
      DEMO_ORGANIZATION_ID,
      'replace' // Use 'replace' mode to ensure a clean import
    );
    
    // Output the results
    if (result.success) {
      console.log('🎉 Import successful!');
      console.log(`📊 Stats: ${result.stats?.productsCreated} products created, ${result.stats?.variantsCreated} variants created`);
      console.log(`📝 Message: ${result.message}`);
    } else {
      console.error('❌ Import failed!');
      console.error(`📝 Error: ${result.message}`);
      
      if (result.stats?.errors && result.stats.errors.length > 0) {
        console.error('🔍 Detailed errors:');
        result.stats.errors.forEach((error, index) => {
          console.error(`  ${index + 1}. ${error}`);
        });
      }
    }
    
    console.log('\n🚀 Done! True North Dispensary inventory has been imported.');
    
  } catch (error) {
    console.error('❌ Unexpected error during import:', error);
  }
}

// Check Supabase connection before running the import
async function verifySupabaseConnection() {
  try {
    console.log('🔌 Checking Supabase connection...');
    
    // Use a simpler query that doesn't use count(*) - just fetch a single row
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection verified!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection check failed:', error.message);
    return false;
  }
}

// Run the import process
(async () => {
  const isConnected = await verifySupabaseConnection();
  if (isConnected) {
    await loadTrueNorthInventory();
  } else {
    console.error('❌ Aborting: Could not connect to Supabase.');
    console.log('💡 Tip: Make sure your .env file contains valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.');
  }
})();