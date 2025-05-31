import fs from 'fs';

console.log('🚀 Efficient True North Inventory Loading');
console.log('=========================================');

// Load the complete combined files
const allProducts = fs.readFileSync('all_products_combined.sql', 'utf8');
const allVariants = fs.readFileSync('all_variants_combined.sql', 'utf8');

// Extract individual INSERT statements
const productInserts = allProducts.split('\n').filter(line => line.trim().startsWith('INSERT INTO products'));
const variantInserts = allVariants.split('\n').filter(line => line.trim().startsWith('INSERT INTO variants'));

console.log(`📦 Found ${productInserts.length} product inserts`);
console.log(`📦 Found ${variantInserts.length} variant inserts`);

// Create optimized chunks
const CHUNK_SIZE = 15; // Smaller chunks to avoid timeouts

// Split products into chunks
const productChunks = [];
for (let i = 0; i < productInserts.length; i += CHUNK_SIZE) {
  productChunks.push(productInserts.slice(i, i + CHUNK_SIZE));
}

// Split variants into chunks
const variantChunks = [];
for (let i = 0; i < variantInserts.length; i += CHUNK_SIZE) {
  variantChunks.push(variantInserts.slice(i, i + CHUNK_SIZE));
}

console.log(`📊 Created ${productChunks.length} product chunks`);
console.log(`📊 Created ${variantChunks.length} variant chunks`);

// Write optimized chunks
console.log('\n🔧 Writing optimized chunks...');

productChunks.forEach((chunk, index) => {
  const filename = `opt_products_${index + 1}.sql`;
  fs.writeFileSync(filename, chunk.join('\n') + '\n');
  console.log(`✅ ${filename}: ${chunk.length} products`);
});

variantChunks.forEach((chunk, index) => {
  const filename = `opt_variants_${index + 1}.sql`;
  fs.writeFileSync(filename, chunk.join('\n') + '\n');
  console.log(`✅ ${filename}: ${chunk.length} variants`);
});

console.log('\n🎯 Ready for systematic loading!');
console.log('Load products first, then variants.');
console.log('Use ON CONFLICT DO NOTHING to avoid duplicates.'); 