import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Environment Check:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', anonKey ? `${anonKey.substring(0, 20)}...` : 'Missing');
console.log('Service Key:', serviceKey ? `${serviceKey.substring(0, 20)}...` : 'Missing');

if (!supabaseUrl) {
  console.error('Missing Supabase URL');
  process.exit(1);
}

async function testConnection(keyType, key) {
  console.log(`\n🔧 Testing ${keyType} key...`);
  
  if (!key) {
    console.log(`❌ ${keyType} key not found`);
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, key);
    
    // Test with organizations table (public read)
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(1);

    if (error) {
      console.log(`❌ ${keyType} failed:`, error.message);
      return false;
    }

    console.log(`✅ ${keyType} works! Found ${data.length} organizations`);
    return { supabase, data };
  } catch (err) {
    console.log(`❌ ${keyType} error:`, err.message);
    return false;
  }
}

async function checkInventoryStatus() {
  // Test both keys
  const anonTest = await testConnection('Anonymous', anonKey);
  const serviceTest = await testConnection('Service Role', serviceKey);

  // Use whichever key works
  let supabase = null;
  if (serviceTest) {
    console.log('\n🎯 Using Service Role key (bypasses RLS)');
    supabase = serviceTest.supabase;
  } else if (anonTest) {
    console.log('\n🎯 Using Anonymous key (subject to RLS)');
    supabase = anonTest.supabase;
  } else {
    console.log('\n❌ Neither key works - connection problem');
    return;
  }

  try {
    // Get organizations
    console.log('\n📊 Fetching all organizations...');
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('*');

    if (orgsError) {
      console.error('❌ Error getting organizations:', orgsError);
      return;
    }

    console.log(`Found ${organizations.length} organizations:`);
    organizations.forEach(org => {
      console.log(`  • ${org.name} (ID: ${org.id})`);
    });

    // Try to get products
    console.log('\n📦 Fetching products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, organization_id, created_at')
      .limit(10); // Limit to avoid large result

    if (productsError) {
      console.error('❌ Error getting products:', productsError);
      console.log('This might be due to RLS if using anonymous key');
      return;
    }

    console.log(`Found ${products.length} products (showing first 10)`);
    
    // Count by organization
    const orgCounts = {};
    products.forEach(product => {
      if (product.organization_id) {
        orgCounts[product.organization_id] = (orgCounts[product.organization_id] || 0) + 1;
      }
    });

    console.log('\n📊 Product counts by organization:');
    organizations.forEach(org => {
      const count = orgCounts[org.id] || 0;
      console.log(`  ${org.name}: ${count} products (in this sample)`);
    });

    // Get total count if we can
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
    } else {
      console.log(`\n📦 Total products in database: ${totalProducts}`);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkInventoryStatus(); 