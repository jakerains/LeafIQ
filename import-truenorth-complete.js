#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCompleteInventory() {
  console.log('🌿 Starting True North Complete Inventory Import...');
  
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, 'truenorthdemodata', 'json-output', 'true_north_complete_inventory.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const importData = JSON.parse(jsonContent);
    
    console.log(`📦 Loaded ${importData.products.length} products from JSON`);
    console.log(`🎯 Target organization: ${importData.metadata.organization_id}`);
    
    // Clear existing inventory for this organization (optional - comment out if you want to keep existing)
    console.log('🗑️ Clearing existing inventory...');
    await supabase
      .from('variants')
      .delete()
      .in('product_id', 
        (await supabase
          .from('products')
          .select('id')
          .eq('organization_id', importData.metadata.organization_id)
        ).data?.map(p => p.id) || []
      );
    
    await supabase
      .from('products')
      .delete()
      .eq('organization_id', importData.metadata.organization_id);
    
    console.log('✅ Existing inventory cleared');
    
    // Import stats
    const stats = {
      productsProcessed: 0,
      variantsProcessed: 0,
      productsCreated: 0,
      variantsCreated: 0,
      errors: []
    };
    
    // Import all products
    for (const product of importData.products) {
      stats.productsProcessed++;
      
      try {
        // Import the product
        const { data: productResult, error: productError } = await supabase
          .rpc('import_product_with_conflict_handling', {
            p_id: product.id,
            p_organization_id: importData.metadata.organization_id,
            p_name: product.name,
            p_brand: product.brand,
            p_category: product.category,
            p_subcategory: product.subcategory || null,
            p_description: product.description || null,
            p_image_url: product.image_url || null,
            p_strain_type: product.strain_type || null
          });
        
        if (productError) {
          stats.errors.push(`Product ${product.name}: ${productError.message}`);
          continue;
        }
        
        stats.productsCreated++;
        
        // Import all variants for this product
        for (const variant of product.variants) {
          stats.variantsProcessed++;
          
          try {
            const { data: variantResult, error: variantError } = await supabase
              .rpc('import_variant_with_conflict_handling', {
                v_id: variant.id,
                v_product_id: product.id,
                v_size_weight: variant.size_weight,
                v_price: variant.price,
                v_original_price: variant.original_price || variant.price,
                v_thc_percentage: variant.thc_percentage || null,
                v_cbd_percentage: variant.cbd_percentage || null,
                v_total_cannabinoids: variant.total_cannabinoids || null,
                v_inventory_level: variant.inventory_level,
                v_is_available: variant.is_available,
                v_terpene_profile: variant.terpene_profile || {}
              });
            
            if (variantError) {
              stats.errors.push(`Variant ${variant.id}: ${variantError.message}`);
            } else {
              stats.variantsCreated++;
            }
          } catch (variantError) {
            stats.errors.push(`Variant ${variant.id}: ${variantError.message}`);
          }
        }
        
        // Progress update every 25 products
        if (stats.productsProcessed % 25 === 0) {
          console.log(`📊 Progress: ${stats.productsProcessed}/${importData.products.length} products processed`);
        }
        
      } catch (productError) {
        stats.errors.push(`Product ${product.name}: ${productError.message}`);
      }
    }
    
    // Final results
    console.log('\n🎉 Import completed!');
    console.log(`📊 Final Stats:`);
    console.log(`  - Products processed: ${stats.productsProcessed}`);
    console.log(`  - Products created: ${stats.productsCreated}`);
    console.log(`  - Variants processed: ${stats.variantsProcessed}`);
    console.log(`  - Variants created: ${stats.variantsCreated}`);
    console.log(`  - Errors: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      stats.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Verify the import
    const { data: finalProducts, error: queryError } = await supabase
      .from('products')
      .select('id, name, category, brand')
      .eq('organization_id', importData.metadata.organization_id);
    
    if (queryError) {
      console.error('❌ Error verifying import:', queryError);
    } else {
      console.log(`\n✅ Verification: ${finalProducts.length} products now in database`);
      
      // Show category breakdown
      const categoryBreakdown = finalProducts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📈 Category breakdown:');
      Object.entries(categoryBreakdown).forEach(([category, count]) => {
        console.log(`  - ${category}: ${count} products`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importCompleteInventory(); 