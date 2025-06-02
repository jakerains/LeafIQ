import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMultipleMarkdownFiles } from '../src/utils/markdownInventoryParser';
import { importInventoryData } from '../src/utils/inventoryImporter';
import { supabase } from '../src/lib/supabase';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Demo organization ID (this is the fixed ID for the demo organization)
const DEMO_ORGANIZATION_ID = 'd85af8c9-0d4a-451c-bc25-8c669c71142e';

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
    const { data, error } = await supabase.from('products').select('count(*)').limit(1);
    
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