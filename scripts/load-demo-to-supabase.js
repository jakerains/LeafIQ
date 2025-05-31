import fs from 'fs';

// Load the SQL data from our generated file
const sqlContent = fs.readFileSync('true-north-demo-data.sql', 'utf8');

// Split into product and variant inserts
const lines = sqlContent.split('\n').filter(line => line.trim());
const productInserts = lines.filter(line => line.includes('INSERT INTO products'));
const variantInserts = lines.filter(line => line.includes('INSERT INTO variants'));

console.log(`Found ${productInserts.length} product inserts and ${variantInserts.length} variant inserts`);

// Function to write SQL chunks to files
function writeSQLChunk(sql, filename) {
  fs.writeFileSync(filename, sql);
  console.log(`✓ Written ${filename}`);
}

// Create product chunks (20 inserts per chunk)
const productChunkSize = 20;
for (let i = 0; i < productInserts.length; i += productChunkSize) {
  const chunk = productInserts.slice(i, i + productChunkSize);
  const sql = chunk.join('\n') + '\n';
  const filename = `products_chunk_${Math.floor(i / productChunkSize) + 1}.sql`;
  writeSQLChunk(sql, filename);
}

// Create variant chunks (30 inserts per chunk)  
const variantChunkSize = 30;
for (let i = 0; i < variantInserts.length; i += variantChunkSize) {
  const chunk = variantInserts.slice(i, i + variantChunkSize);
  const sql = chunk.join('\n') + '\n';
  const filename = `variants_chunk_${Math.floor(i / variantChunkSize) + 1}.sql`;
  writeSQLChunk(sql, filename);
}

console.log('\n✅ SQL chunks created for demo data loading');
console.log(`📦 Products: ${Math.ceil(productInserts.length / productChunkSize)} files`);
console.log(`📦 Variants: ${Math.ceil(variantInserts.length / variantChunkSize)} files`);
console.log('\n🌿 Ready to load True North Dispensary demo data!'); 