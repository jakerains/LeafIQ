import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function testFrontendLiveState() {
  console.log('🎯 Testing Live Frontend State\n');

  try {
    // 1. Check current Supabase session
    console.log('1️⃣ Checking current Supabase session...');
    const { data: session } = await supabase.auth.getSession();
    
    if (session.session) {
      console.log('✅ Active session found:');
      console.log('   User:', session.session.user.email);
      console.log('   Session expires:', new Date(session.session.expires_at * 1000).toLocaleString());
      
      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, organizations(name)')
        .eq('user_id', session.session.user.id)
        .single();
      
      if (profile) {
        console.log('✅ User profile found:');
        console.log('   Organization ID:', profile.organization_id);
        console.log('   Organization Name:', profile.organizations?.name);
        console.log('   Role:', profile.role);
        
        // Test product access with this organization
        const { data: products, error: prodError } = await supabase
          .from('products')
          .select('count(*)', { count: 'exact', head: true })
          .eq('organization_id', profile.organization_id);
        
        console.log('   Products accessible:', products || 0, prodError ? `(Error: ${prodError.message})` : '');
      } else {
        console.log('❌ No profile found:', profileError?.message);
      }
    } else {
      console.log('❌ No active session found');
    }

    // 2. Simulate localStorage check (what the frontend might be using)
    console.log('\n2️⃣ Simulating localStorage state check...');
    console.log('   Note: This script can\'t access browser localStorage');
    console.log('   In browser, check: localStorage.getItem("simple-auth-storage")');

    // 3. Test direct login and state
    console.log('\n3️⃣ Testing fresh login flow...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@leafiq.online',
      password: 'demo123'
    });

    if (authData.user) {
      console.log('✅ Fresh login successful');
      
      // Get profile again
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('*, organizations(name)')
        .eq('user_id', authData.user.id)
        .single();
      
      if (freshProfile) {
        console.log('✅ Fresh profile loaded:');
        console.log('   Organization ID:', freshProfile.organization_id);
        console.log('   Organization Name:', freshProfile.organizations?.name);
        
        // Test inventory access immediately after login
        const { data: inventoryTest, error: invError } = await supabase
          .from('products')
          .select('id, name, brand')
          .eq('organization_id', freshProfile.organization_id)
          .limit(5);
        
        console.log('\n📦 Inventory test after fresh login:');
        console.log('   Products found:', inventoryTest?.length || 0);
        if (inventoryTest && inventoryTest.length > 0) {
          console.log('   Sample products:');
          inventoryTest.forEach(p => {
            console.log(`     • ${p.name} (${p.brand})`);
          });
        }
        
        if (invError) {
          console.log('   Error:', invError.message);
        }
      }
    } else {
      console.log('❌ Fresh login failed:', authError?.message);
    }

    // 4. Check for any RLS issues
    console.log('\n4️⃣ Checking RLS policy status...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('who_am_i');
    
    console.log('Current auth context:', policies);

    // 5. Check organization existence
    console.log('\n5️⃣ Verifying High Vibe Supply organization...');
    const { data: trueNorth, error: tnError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', 'd85af8c9-0d4a-451c-bc25-8c669c71142e')
      .single();
    
    if (trueNorth) {
      console.log('✅ High Vibe Supply organization found:');
      console.log('   Name:', trueNorth.name);
      console.log('   Status:', trueNorth.subscription_status);
      console.log('   Plan:', trueNorth.plan_type);
    } else {
      console.log('❌ High Vibe Supply organization not found:', tnError?.message);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testFrontendLiveState(); 