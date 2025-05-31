import fs from 'fs';

// Function to read and split SQL file
function loadSQLData() {
  const sqlContent = fs.readFileSync('true-north-demo-data-uuid.sql', 'utf8');
  const lines = sqlContent.split('\n').filter(line => line.trim());
  
  const productInserts = lines.filter(line => line.includes('INSERT INTO products'));
  const variantInserts = lines.filter(line => line.includes('INSERT INTO variants'));
  
  console.log(`📦 Found ${productInserts.length} products and ${variantInserts.length} variants`);
  
  return { productInserts, variantInserts };
}

// Split into chunks
function createChunks(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Write chunks to files
function writeChunks(chunks, type) {
  chunks.forEach((chunk, index) => {
    const sql = chunk.join('\n') + '\n';
    const filename = `${type}_batch_${index + 1}.sql`;
    fs.writeFileSync(filename, sql);
    console.log(`✅ Created ${filename} (${chunk.length} items)`);
  });
  return chunks.length;
}

// Main execution
const { productInserts, variantInserts } = loadSQLData();

// Create product batches (10 per batch)
const productChunks = createChunks(productInserts, 10);
const productFiles = writeChunks(productChunks, 'products');

// Create variant batches (20 per batch)
const variantChunks = createChunks(variantInserts, 20);
const variantFiles = writeChunks(variantChunks, 'variants');

console.log(`\n🎯 Created ${productFiles} product batch files`);
console.log(`🎯 Created ${variantFiles} variant batch files`);
console.log('\n📋 Load order:');
console.log('1. Load all product batches first (products_batch_*.sql)');
console.log('2. Then load all variant batches (variants_batch_*.sql)');
console.log('\n🌿 Ready to populate True North Dispensary!'); 