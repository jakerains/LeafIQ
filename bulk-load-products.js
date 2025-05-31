import fs from 'fs';
import { execSync } from 'child_process';

// Get all product chunk files
const chunkFiles = fs.readdirSync('.')
  .filter(file => file.startsWith('products_chunk_'))
  .sort();

console.log(`🚀 Loading ${chunkFiles.length} product chunks...`);

let totalProducts = 0;

for (const chunkFile of chunkFiles) {
  try {
    const content = fs.readFileSync(chunkFile, 'utf8').trim();
    if (content) {
      const insertCount = (content.match(/INSERT INTO products/g) || []).length;
      totalProducts += insertCount;
      console.log(`✅ ${chunkFile}: ${insertCount} products`);
    }
  } catch (error) {
    console.error(`❌ Error loading ${chunkFile}:`, error.message);
  }
}

console.log(`\n📦 Total products ready: ${totalProducts}`);
console.log('🎯 Use Supabase MCP tool to load each chunk systematically.');

// Show content of first chunk as example
console.log('\n📋 First chunk preview:');
const firstChunk = fs.readFileSync(chunkFiles[0], 'utf8');
console.log(firstChunk.substring(0, 500) + '...'); 