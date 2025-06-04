import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function testSessionManagement() {
  console.log('🧪 Testing Session Management Fix\n');

  try {
    // 1. Check initial session state
    console.log('1️⃣ Checking initial session state...');
    const { data: initialSession } = await supabase.auth.getSession();
    console.log('Initial session:', initialSession.session ? '✅ Active' : '❌ None');

    // 2. Simulate fresh login
    console.log('\n2️⃣ Simulating fresh login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@leafiq.online',
      password: 'demo123'
    });

    if (authError) {
      console.log('❌ Login failed:', authError.message);
      return;
    }

    console.log('✅ Login successful');
    console.log('   User:', authData.user?.email);
    console.log('   Session expires:', new Date(authData.session?.expires_at * 1000).toLocaleString());

    // 3. Test session persistence simulation
    console.log('\n3️⃣ Testing session persistence...');
    
    // Wait a moment then check session again (simulates page refresh)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data: persistedSession } = await supabase.auth.getSession();
    console.log('Session after delay:', persistedSession.session ? '✅ Persisted' : '❌ Lost');

    if (persistedSession.session) {
      console.log('   Session ID:', persistedSession.session.session_id);
      console.log('   User:', persistedSession.session.user.email);
    }

    // 4. Test profile access with persisted session
    console.log('\n4️⃣ Testing profile access...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, organizations(name)')
      .eq('user_id', persistedSession.session?.user.id)
      .single();

    if (profile) {
      console.log('✅ Profile accessible:');
      console.log('   Organization:', profile.organizations?.name);
      console.log('   Organization ID:', profile.organization_id);
    } else {
      console.log('❌ Profile access failed:', profileError?.message);
    }

    // 5. Test product access with organization context
    console.log('\n5️⃣ Testing inventory access...');
    if (profile?.organization_id) {
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, brand')
        .eq('organization_id', profile.organization_id)
        .limit(3);

      if (products && products.length > 0) {
        console.log('✅ Inventory accessible:');
        products.forEach(p => {
          console.log(`   • ${p.name} (${p.brand})`);
        });
      } else {
        console.log('❌ Inventory access failed:', prodError?.message);
      }
    }

    // 6. Test auth state change events
    console.log('\n6️⃣ Testing auth state change listener...');
    
    let eventReceived = false;
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`   Event received: ${event}`);
      if (event === 'SIGNED_OUT') {
        eventReceived = true;
        console.log('   ✅ Sign out event captured');
      }
    });

    // Trigger a sign out
    await supabase.auth.signOut();
    
    // Wait for event
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (eventReceived) {
      console.log('✅ Auth state change events working');
    } else {
      console.log('❌ Auth state change events not working');
    }

    unsubscribe();

    // 7. Verify session is cleared
    console.log('\n7️⃣ Verifying session cleanup...');
    const { data: finalSession } = await supabase.auth.getSession();
    console.log('Final session:', finalSession.session ? '❌ Still active' : '✅ Cleared');

    console.log('\n🎯 Session Management Test Complete!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testSessionManagement(); 