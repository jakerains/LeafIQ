// Test the complete search flow to debug why the UI gets stuck

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDc4ODAsImV4cCI6MjA2NDI4Mzg4MH0.4tLWKOGAL-oY9jVBVXgBIkkCOEbGNS-IVlJZ8YPNryc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCompleteSearchFlow() {
  console.log('🔍 Testing Complete Kiosk Search Flow...\n');

  // Test 1: Check products are available
  console.log('1️⃣ Testing product availability...');
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        variants (*)
      `)
      .limit(5);

    if (productsError) {
      console.log('❌ Products Error:', productsError);
    } else {
      console.log('✅ Products available:', products?.length || 0);
      if (products && products.length > 0) {
        console.log('First product:', {
          name: products[0].name,
          hasVariants: products[0].variants?.length || 0
        });
      }
    }
  } catch (err) {
    console.log('💥 Products Exception:', err.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Test AI Edge Function directly
  console.log('2️⃣ Testing AI Edge Function...');
  
  const testQueries = [
    { query: 'relaxed', mode: 'vibe' },
    { query: 'activity: watching a movie', mode: 'activity' },
    { query: 'energized', mode: 'vibe' },
    { query: 'activity: going hiking', mode: 'activity' }
  ];

  for (const testQuery of testQueries) {
    console.log(`\n🧪 Testing: "${testQuery.query}" (${testQuery.mode})`);
    
    try {
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('ai-recommendations-public', {
        body: testQuery.mode === 'vibe' 
          ? { query: testQuery.query, vibe: testQuery.query }
          : { query: testQuery.query, activity: testQuery.query.replace('activity: ', '') }
      });

      const duration = Date.now() - startTime;
      
      if (error) {
        console.log(`❌ AI Error (${duration}ms):`, error);
      } else {
        console.log(`✅ AI Success (${duration}ms):`, {
          recommendations: data?.recommendations?.length || 0,
          hasMessage: !!data?.personalizedMessage,
          hasEffects: data?.effects?.length || 0,
          messagePreview: data?.personalizedMessage?.substring(0, 40) + '...'
        });
      }
    } catch (err) {
      console.log('💥 AI Exception:', err.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Test the recommendation engine logic simulation
  console.log('3️⃣ Testing recommendation flow simulation...');
  
  async function simulateKioskSearch(query, mode) {
    console.log(`\n🎯 Simulating kiosk search: "${query}" (${mode})`);
    
    try {
      // Step 1: Fetch products (simulate productsStore.fetchProducts)
      console.log('  📦 Step 1: Fetching products...');
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          category,
          strain_type,
          variants!inner (
            id,
            price,
            inventory_level,
            is_available,
            thc_percentage,
            cbd_percentage,
            terpene_profile
          )
        `)
        .eq('variants.is_available', true)
        .gt('variants.inventory_level', 0);

      if (productsError) {
        throw new Error(`Products fetch failed: ${productsError.message}`);
      }

      console.log(`  ✅ Products fetched: ${products?.length || 0} available`);

      // Step 2: Call AI recommendations
      console.log('  🤖 Step 2: Getting AI recommendations...');
      const enhancedQuery = mode === 'activity' ? `activity: ${query}` : query;
      
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-recommendations-public', {
        body: mode === 'vibe' 
          ? { query: enhancedQuery, vibe: enhancedQuery }
          : { query: enhancedQuery, activity: query }
      });

      if (aiError) {
        throw new Error(`AI recommendations failed: ${aiError.message}`);
      }

      console.log('  ✅ AI recommendations received:', {
        recommendations: aiData?.recommendations?.length || 0,
        effects: aiData?.effects?.length || 0,
        hasMessage: !!aiData?.personalizedMessage
      });

      // Step 3: Simulate navigation
      console.log('  🧭 Step 3: Navigation simulation...');
      console.log('  ✅ Would navigate to /kiosk/results with state:', {
        searchQuery: query,
        searchResults: products?.slice(0, 3) || [],
        isAIPowered: !!aiData?.recommendations?.length,
        effects: aiData?.effects || [],
        personalizedMessage: !!aiData?.personalizedMessage
      });

      return {
        success: true,
        products: products?.slice(0, 3) || [],
        aiData
      };

    } catch (error) {
      console.log(`  ❌ Simulation failed:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Run simulations
  const simulations = [
    { query: 'relaxed', mode: 'vibe' },
    { query: 'watching a movie', mode: 'activity' },
    { query: 'energized', mode: 'vibe' },
    { query: 'going hiking', mode: 'activity' }
  ];

  for (const sim of simulations) {
    await simulateKioskSearch(sim.query, sim.mode);
  }

  console.log('\n🏁 Complete search flow testing finished');
}

testCompleteSearchFlow()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Test failed:', err);
    process.exit(1);
  }); 