import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const organizationId = 'd85af8c9-0d4a-451c-bc25-8c669c71142e'; // True North org ID

// Parse markdown files to extract product data
function parseMarkdownFiles() {
  const dataDir = path.join(__dirname, '../truenorthdemodata');
  const products = [];
  const variants = [];
  
  // Map of file names to categories
  const categoryMap = {
    'true_north_flower.md': 'flower',
    'true_north_prerolls.md': 'pre_rolls', 
    'true_north_vaporizers.md': 'vaporizers',
    'true_north_edibles.md': 'edibles',
    'true_north_concentrates.md': 'concentrates',
    'true_north_tinctures.md': 'tinctures'
  };

  Object.entries(categoryMap).forEach(([filename, category]) => {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsedProducts = parseMarkdownContent(content, category);
      
      parsedProducts.forEach((item, index) => {
        const productId = randomUUID(); // Generate UUID for product
        
        // Create product record
        products.push({
          id: productId,
          organization_id: organizationId,
          name: item.name,
          brand: item.brand,
          category: category,
          subcategory: item.subcategory,
          description: item.description,
          image_url: item.image_url,
          strain_type: item.strain_type
        });
        
        // Create variants
        if (item.variants && item.variants.length > 0) {
          item.variants.forEach((variant, variantIndex) => {
            variants.push({
              id: randomUUID(), // Generate UUID for variant
              product_id: productId,
              size_weight: variant.size_weight,
              price: variant.price,
              original_price: variant.original_price,
              thc_percentage: variant.thc_percentage,
              cbd_percentage: variant.cbd_percentage,
              inventory_level: Math.floor(Math.random() * 20) + 5,
              is_available: true
            });
          });
        } else {
          // Create single variant if no variants specified
          variants.push({
            id: randomUUID(), // Generate UUID for variant
            product_id: productId,
            size_weight: item.size || '1g',
            price: item.price,
            original_price: item.original_price,
            thc_percentage: item.thc_percentage,
            cbd_percentage: item.cbd_percentage,
            inventory_level: Math.floor(Math.random() * 20) + 5,
            is_available: true
          });
        }
      });
    }
  });

  return { products, variants };
}

function parseMarkdownContent(content, category) {
  const products = [];
  const lines = content.split('\n');
  let currentProduct = null;
  let inProductSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip headers and metadata
    if (line.startsWith('#') && !line.startsWith('####')) {
      continue;
    }
    
    // Product headers (#### Product Name)
    if (line.startsWith('#### ') && !line.includes('**')) {
      if (currentProduct) {
        products.push(currentProduct);
      }
      
      const productName = line.substring(4).trim();
      const isStaffPick = productName.includes('⭐ Staff Pick');
      const isDiscounted = productName.includes('💸 15% OFF');
      const cleanName = productName.replace('⭐ Staff Pick', '').replace('💸 15% OFF', '').trim();
      
      currentProduct = {
        name: cleanName,
        brand: null,
        strain_type: null,
        thc_percentage: null,
        cbd_percentage: null,
        price: null,
        original_price: isDiscounted ? null : undefined,
        size: null,
        image_url: null,
        description: null,
        subcategory: null,
        variants: [],
        is_staff_pick: isStaffPick,
        is_discounted: isDiscounted
      };
      inProductSection = true;
    }
    
    // Image URLs
    else if (line.startsWith('![') && currentProduct) {
      const imageMatch = line.match(/\((https?:\/\/[^)]+)\)/);
      if (imageMatch) {
        currentProduct.image_url = imageMatch[1];
      }
    }
    
    // Product details (- **Brand:** etc.)
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
            currentProduct.strain_type = normalizeStrainType(value);
            if (category === 'pre_rolls' && value.toLowerCase().includes('blunt')) {
              currentProduct.subcategory = 'blunt';
            } else if (category === 'edibles') {
              currentProduct.subcategory = normalizeSubcategory(value);
            } else if (category === 'vaporizers') {
              currentProduct.subcategory = normalizeVapeType(value);
            } else if (category === 'concentrates') {
              currentProduct.subcategory = normalizeConcentrateType(value);
            }
            break;
          case 'thc':
            currentProduct.thc_percentage = parsePercentage(value);
            break;
          case 'cbd':
            currentProduct.cbd_percentage = parsePercentage(value);
            break;
          case 'size':
            currentProduct.size = value;
            break;
          case 'price':
            currentProduct.price = parsePrice(value);
            break;
          case 'pricing':
            // Handle complex pricing for flower
            currentProduct.variants = parsePricingString(value);
            break;
        }
      }
    }
    
    // End of product section
    else if (line === '---' || line.startsWith('## ') || (line === '' && inProductSection)) {
      if (currentProduct && lines[i + 1] && lines[i + 1].startsWith('#### ')) {
        // End of current product, start of next
        continue;
      }
    }
  }
  
  // Add the last product
  if (currentProduct) {
    products.push(currentProduct);
  }
  
  return products.map(product => {
    // Generate description
    let description = '';
    if (product.strain_type) {
      description += `${product.strain_type} `;
    }
    if (category) {
      description += `${category.replace('_', ' ')} `;
    }
    if (product.thc_percentage) {
      description += `with ${product.thc_percentage}% THC`;
    }
    product.description = description.trim();
    
    return product;
  });
}

function normalizeStrainType(type) {
  if (!type) return 'hybrid';
  const lower = type.toLowerCase();
  if (lower.includes('indica')) return 'indica';
  if (lower.includes('sativa')) return 'sativa';
  return 'hybrid';
}

function normalizeSubcategory(value) {
  const lower = value.toLowerCase();
  if (lower.includes('gummies') || lower.includes('gummy')) return 'gummies';
  if (lower.includes('lollipop') || lower.includes('lolli')) return 'lollipops';
  if (lower.includes('caramel')) return 'caramels';
  if (lower.includes('honey')) return 'honey';
  if (lower.includes('drink')) return 'drinks';
  return 'other';
}

function normalizeVapeType(value) {
  const lower = value.toLowerCase();
  if (lower.includes('disposable')) return 'disposable';
  if (lower.includes('cartridge') || lower.includes('cart')) return 'cartridge';
  if (lower.includes('pod')) return 'pod';
  if (lower.includes('distillate')) return 'distillate';
  if (lower.includes('live rosin')) return 'live_rosin';
  if (lower.includes('live resin')) return 'live_resin';
  if (lower.includes('liquid diamond')) return 'liquid_diamond';
  if (lower.includes('cured resin')) return 'cured_resin';
  return 'other';
}

function normalizeConcentrateType(value) {
  const lower = value.toLowerCase();
  if (lower.includes('live rosin')) return 'live_rosin';
  if (lower.includes('fresh press')) return 'fresh_press';
  if (lower.includes('badder') || lower.includes('batter')) return 'badder';
  if (lower.includes('sugar') || lower.includes('terp')) return 'sugar';
  if (lower.includes('live resin')) return 'live_resin';
  if (lower.includes('cured resin')) return 'cured_resin';
  if (lower.includes('thumbprint')) return 'thumbprint';
  if (lower.includes('disposable')) return 'disposable';
  if (lower.includes('syringe') || lower.includes('rso')) return 'syringe';
  if (lower.includes('capsule')) return 'capsules';
  return 'other';
}

function parsePercentage(value) {
  const match = value.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

function parsePrice(value) {
  const match = value.match(/\$(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

function parsePricingString(pricingStr) {
  // Handle complex pricing like "$25/3.5g, $30/4.2g, $45/7g"
  const variants = [];
  const priceMatches = pricingStr.match(/\$(\d+\.?\d*)\/([^,]+)/g);
  
  if (priceMatches) {
    priceMatches.forEach((match, index) => {
      const [, price, weight] = match.match(/\$(\d+\.?\d*)\/(.+)/);
      variants.push({
        size_weight: weight.trim(),
        price: parseFloat(price),
        original_price: null,
        thc_percentage: null,
        cbd_percentage: null
      });
    });
  }
  
  return variants;
}

// Transform the data
const { products, variants } = parseMarkdownFiles();

// Generate SQL statements
console.log('-- True North Dispensary Demo Data Load');
console.log('-- Products:', products.length);
console.log('-- Variants:', variants.length);
console.log();

// Generate product insert statements
console.log('-- Insert products');
products.forEach(product => {
  const values = [
    `'${product.id}'`,
    `'${product.organization_id}'`,
    `'${product.name.replace(/'/g, "''")}'`,
    product.brand ? `'${product.brand.replace(/'/g, "''")}'` : 'NULL',
    `'${product.category}'`,
    product.subcategory ? `'${product.subcategory}'` : 'NULL',
    product.description ? `'${product.description.replace(/'/g, "''")}'` : 'NULL',
    product.image_url ? `'${product.image_url}'` : 'NULL',
    product.strain_type ? `'${product.strain_type}'` : 'NULL'
  ];
  
  console.log(`INSERT INTO products (id, organization_id, name, brand, category, subcategory, description, image_url, strain_type) VALUES (${values.join(', ')});`);
});

console.log();
console.log('-- Insert variants');

// Generate variant insert statements
variants.forEach(variant => {
  const values = [
    `'${variant.id}'`,
    `'${variant.product_id}'`,
    variant.size_weight ? `'${variant.size_weight}'` : 'NULL',
    variant.price || 'NULL',
    variant.original_price || 'NULL',
    variant.thc_percentage || 'NULL',
    variant.cbd_percentage || 'NULL',
    'NULL', // total_cannabinoids
    variant.inventory_level,
    variant.is_available
  ];
  
  console.log(`INSERT INTO variants (id, product_id, size_weight, price, original_price, thc_percentage, cbd_percentage, total_cannabinoids, inventory_level, is_available) VALUES (${values.join(', ')});`);
});

console.log();
console.log(`-- Total products: ${products.length}`);
console.log(`-- Total variants: ${variants.length}`); 