#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple validation function matching LeafIQ's import validation logic
 */
function validateImportData(data) {
  const errors = [];

  // Check top-level structure
  if (!data || typeof data !== 'object') {
    errors.push('Invalid JSON structure');
    return { valid: false, errors };
  }

  // Check metadata
  if (!data.metadata) {
    errors.push('Missing metadata section');
  } else {
    if (!data.metadata.format_version) {
      errors.push('Missing format_version in metadata');
    }
    if (!data.metadata.organization_id) {
      errors.push('Missing organization_id in metadata');
    }
  }

  // Check products array
  if (!data.products || !Array.isArray(data.products)) {
    errors.push('Missing or invalid products array');
    return { valid: false, errors };
  }

  if (data.products.length === 0) {
    errors.push('Products array is empty');
  }

  // Validate each product
  data.products.forEach((product, index) => {
    const productPrefix = `Product ${index + 1}`;

    if (!product.id) {
      errors.push(`${productPrefix}: Missing id`);
    }
    if (!product.name) {
      errors.push(`${productPrefix}: Missing name`);
    }
    if (!product.brand) {
      errors.push(`${productPrefix}: Missing brand`);
    }
    if (!product.category) {
      errors.push(`${productPrefix}: Missing category`);
    }

    // Validate variants
    if (!product.variants || !Array.isArray(product.variants)) {
      errors.push(`${productPrefix}: Missing or invalid variants array`);
    } else if (product.variants.length === 0) {
      errors.push(`${productPrefix}: Must have at least one variant`);
    } else {
      product.variants.forEach((variant, variantIndex) => {
        const variantPrefix = `${productPrefix}, Variant ${variantIndex + 1}`;

        if (!variant.id) {
          errors.push(`${variantPrefix}: Missing id`);
        }
        if (!variant.size_weight) {
          errors.push(`${variantPrefix}: Missing size_weight`);
        }
        if (typeof variant.price !== 'number' || variant.price < 0) {
          errors.push(`${variantPrefix}: Invalid price`);
        }
        if (typeof variant.inventory_level !== 'number' || variant.inventory_level < 0) {
          errors.push(`${variantPrefix}: Invalid inventory_level`);
        }
        if (typeof variant.is_available !== 'boolean') {
          errors.push(`${variantPrefix}: Invalid is_available (must be boolean)`);
        }
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Test all generated JSON files
 */
async function testAllJsonFiles() {
  console.log('🧪 Testing generated JSON files for import compatibility...\n');
  
  const outputDir = path.join(__dirname, '..', 'truenorthdemodata', 'json-output');
  
  if (!fs.existsSync(outputDir)) {
    console.log('❌ No output directory found. Run convert script first.');
    return;
  }
  
  const jsonFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('❌ No JSON files found. Run convert script first.');
    return;
  }
  
  let totalTests = 0;
  let passedTests = 0;
  let totalProducts = 0;
  let totalVariants = 0;
  
  for (const file of jsonFiles) {
    console.log(`🔍 Testing ${file}...`);
    
    try {
      const filePath = path.join(outputDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      const validation = validateImportData(data);
      totalTests++;
      
      if (validation.valid) {
        console.log(`   ✅ Valid - ${data.products.length} products`);
        passedTests++;
        totalProducts += data.products.length;
        
        // Count variants
        data.products.forEach(product => {
          totalVariants += product.variants.length;
        });
        
      } else {
        console.log(`   ❌ Invalid:`);
        validation.errors.forEach(error => {
          console.log(`      - ${error}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ JSON Parse Error: ${error.message}`);
      totalTests++;
    }
    
    console.log('');
  }
  
  console.log('📊 Test Summary:');
  console.log(`   Files tested: ${totalTests}`);
  console.log(`   Files passed: ${passedTests}`);
  console.log(`   Total products: ${totalProducts}`);
  console.log(`   Total variants: ${totalVariants}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All JSON files are valid and ready for import!');
    console.log('\n💡 Next steps:');
    console.log('   1. Update ORGANIZATION_ID in convert script');
    console.log('   2. Open LeafIQ admin panel');
    console.log('   3. Go to Import/Export > JSON Import');
    console.log('   4. Upload any of the validated JSON files');
    console.log('   5. Choose import mode and import! 🚀');
  } else {
    console.log('\n⚠️  Some files failed validation. Fix issues before importing.');
  }
}

// Run the tests
testAllJsonFiles().catch(console.error); 