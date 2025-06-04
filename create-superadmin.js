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
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
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
    // First check if the user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('role', 'super_admin')
      .maybeSingle();

    if (checkError) {
      console.log('Error checking existing super admin:', checkError.message);
      // Continue with creation attempt
    } else if (existingUser) {
      console.log('⚠️  A super admin already exists in the system.');
      console.log('If you need to create a new one, either update the existing user or remove it first.');
      return;
    }
    
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
      if (authError.message.includes('already registered')) {
        console.log('User already exists, updating their role to super_admin');
        
        // Get user ID for existing user
        const { data: userData } = await supabase.auth.admin.listUsers();
        const existingUser = userData?.users.find(u => u.email === email);
        
        if (existingUser) {
          // Create or update profile with super_admin role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .upsert({
              user_id: existingUser.id,
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
            console.error('Error updating profile to super_admin:', profileError);
            return;
          }
          
          console.log('Profile updated successfully to super_admin role:', profile.id);
        } else {
          console.error('Could not find existing user');
          return;
        }
      } else {
        console.error('Error creating user:', authError);
        return;
      }
    } else {
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
    }

    console.log('\n✅ Super Admin user created/updated successfully!');
    console.log('Email:', email);
    console.log('Password: [REDACTED]');
    console.log('Role: super_admin');
    console.log('Organization: Demo Dispensary');
    
    console.log('\nYou can now log in with these credentials and access the superadmin panel.');
    console.log('Access Steps:');
    console.log('1. Navigate to /app in your browser');
    console.log('2. Login with your credentials');
    console.log('3. Select "Admin Panel" and enter passkey: 1234');
    console.log('4. You should now see the Superadmin tab in the admin interface');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
createSuperAdminUser();