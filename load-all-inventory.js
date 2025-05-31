import fs from 'fs';

console.log('🌿 Loading Complete True North Inventory');
console.log('=======================================');

// Combine all product batches
let allProducts = '';
for (let i = 1; i <= 18; i++) {
  const filename = `products_batch_${i}.sql`;
  if (fs.existsSync(filename)) {
    const content = fs.readFileSync(filename, 'utf8');
    allProducts += content + '\n';
  }
}

// Combine all variant batches  
let allVariants = '';
for (let i = 1; i <= 17; i++) {
  const filename = `variants_batch_${i}.sql`;
  if (fs.existsSync(filename)) {
    const content = fs.readFileSync(filename, 'utf8');
    allVariants += content + '\n';
  }
}

// Write combined files
fs.writeFileSync('all_products_combined.sql', allProducts);
fs.writeFileSync('all_variants_combined.sql', allVariants);

// Count statements
const productCount = (allProducts.match(/INSERT INTO products/g) || []).length;
const variantCount = (allVariants.match(/INSERT INTO variants/g) || []).length;

console.log(`📦 Products: ${productCount} INSERT statements`);
console.log(`📦 Variants: ${variantCount} INSERT statements`);
console.log('✅ Combined files created:');
console.log('   - all_products_combined.sql');
console.log('   - all_variants_combined.sql');
console.log('🚀 Ready for bulk loading!'); 