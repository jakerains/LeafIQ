import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://rhczixubnzpnhffotqwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoY3ppeHVibnpwbmhmZm90cXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NjA0NzcsImV4cCI6MjA1MDIzNjQ3N30.cOiJCDMN1kJfJYs8RHqKL9wlSTvWTRpC3-vRONJOuuE'
);

console.log('🧪 Testing Products Store with New Auth System...\n');

async function testProductsFetch() {
  try {
    // 1. Test demo login
    console.log('1. Testing demo login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@leafiq.online',
      password: 'demo1234'
    });

    if (authError || !authData.user) {
      throw new Error(`Login failed: ${authError?.message || 'No user returned'}`);
    }
    
    console.log('✅ Login successful:', authData.user.email);

    // 2. Get user profile and organization
    console.log('\n2. Getting user profile and organization...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        role,
        organization_id,
        organizations!inner (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error(`Profile fetch failed: ${profileError?.message || 'No profile found'}`);
    }

    console.log('✅ Profile found:');
    console.log('   Organization:', profile.organizations.name);
    console.log('   Organization ID:', profile.organization_id);
    console.log('   Role:', profile.role);

    // 3. Test products fetch
    console.log('\n3. Testing products fetch...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('name')
      .limit(5);

    if (productsError) {
      throw new Error(`Products fetch failed: ${productsError.message}`);
    }

    console.log(`✅ Products found: ${products?.length || 0} products`);
    if (products && products.length > 0) {
      console.log('   Sample products:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.brand})`);
      });
    }

    // 4. Test variants fetch
    console.log('\n4. Testing variants fetch...');
    const productIds = products?.map(p => p.id) || [];
    if (productIds.length > 0) {
      const { data: variants, error: variantsError } = await supabase
        .from('variants')
        .select('*')
        .in('product_id', productIds)
        .limit(5);

      if (variantsError) {
        throw new Error(`Variants fetch failed: ${variantsError.message}`);
      }

      console.log(`✅ Variants found: ${variants?.length || 0} variants`);
      if (variants && variants.length > 0) {
        console.log('   Sample variants:');
        variants.slice(0, 3).forEach((variant, index) => {
          console.log(`   ${index + 1}. $${variant.price} - Inventory: ${variant.inventory_level}`);
        });
      }
    }

    // 5. Cleanup
    await supabase.auth.signOut();
    console.log('\n✅ Signed out successfully');

    console.log('\n🎉 PRODUCTS STORE TEST COMPLETED!');
    console.log('✅ Auth integration working');
    console.log('✅ Organization context found');
    console.log('✅ Products and variants accessible');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
    
    // Cleanup on error
    try {
      await supabase.auth.signOut();
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
  }
}

testProductsFetch(); 