import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// User credentials to create
const email = 'jakerains@gmail.com';
const password = 'DexDunk16710!';
const demoOrgId = 'd85af8c9-0d4a-451c-bc25-8c669c71142e'; // Demo Dispensary organization ID

async function createSuperAdminUser() {
  console.log('Creating super admin user...');
  
  try {
    // 1. Create the user with admin metadata
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Admin',
        role: 'super_admin'
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('User created successfully:', authData.user.id);
    
    // 2. Create profile with super_admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        organization_id: demoOrgId,
        role: 'super_admin',
        full_name: 'Super Admin',
        use_mode: 'both',
        menu_source: 'manual',
        enable_demo_inventory: true,
        wants_onboarding: false
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('Profile created successfully:', profile.id);
    console.log('\n✅ Super Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password: [REDACTED]');
    console.log('Role: super_admin');
    console.log('Organization: Demo Dispensary');
    
    console.log('\nYou can now log in with these credentials and access the superadmin panel.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
createSuperAdminUser();