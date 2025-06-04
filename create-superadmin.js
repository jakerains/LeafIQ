import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment variables from ${envPath}`);
    dotenv.config({ path: envPath });
  } else {
    console.log('No .env file found, using environment variables directly');
    dotenv.config();
  }
} catch (e) {
  console.log('Error loading .env file, will try using environment variables directly:', e.message);
}

// Supabase credentials
const supabaseUrl = 'https://xaddlctkbrdeigeqfswd.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => !key.startsWith('npm_')));
  console.log('\nTo fix this issue:');
  console.log('1. Create a .env file in the project root with the following content:');
  console.log('   VITE_SUPABASE_URL=your-supabase-url');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('2. Or run the script with the environment variables set:');
  console.log('   VITE_SUPABASE_URL=your-url SUPABASE_SERVICE_ROLE_KEY=your-key node create-superadmin.js');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log('Service role key is present and loaded');

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSuperadmin() {
  console.log('🔧 Creating Superadmin Account...\n');
  
  try {
    // 1. Create user using admin API
    console.log('1. Creating user account...');
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'jakerains@gmail.com',
      password: 'SuperAdmin2025!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Jake Rains',
        role: 'super_admin'
      }
    });

    if (createError) {
      console.error('❌ Failed to create user:', createError.message);
            return;
          }
          
    console.log('✅ User created successfully!');
    console.log('   User ID:', userData.user.id);
    console.log('   Email:', userData.user.email);
      
    // 2. Create profile
    console.log('\n2. Creating profile...');
    const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
        user_id: userData.user.id,
        organization_id: null, // Super admin is not tied to any organization
          role: 'super_admin',
        full_name: 'Jake Rains',
          use_mode: 'both',
          menu_source: 'manual',
          enable_demo_inventory: true,
          wants_onboarding: false
        })
        .select()
        .single();

      if (profileError) {
      console.error('❌ Failed to create profile:', profileError.message);
        return;
      }

    console.log('✅ Profile created successfully!');
    console.log('   Profile ID:', profileData.id);
    console.log('   Role:', profileData.role);
    
    console.log('\n🎉 SUCCESS: Superadmin account created!');
    console.log('📍 Credentials:');
    console.log('   Email: jakerains@gmail.com');
    console.log('   Password: SuperAdmin2025!');
    console.log('   Dashboard: http://localhost:5173/superadmin');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run the script
createSuperadmin();