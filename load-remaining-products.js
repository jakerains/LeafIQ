// Let me create a quick script to load the remaining products efficiently
import fs from 'fs';

// Read all product batch files and output the SQL
console.log('-- Loading remaining product batches 4-18');

for (let i = 4; i <= 18; i++) {
  const filename = `products_batch_${i}.sql`;
  if (fs.existsSync(filename)) {
    const content = fs.readFileSync(filename, 'utf8');
    console.log(`-- Batch ${i}`);
    console.log(content);
  }
} 