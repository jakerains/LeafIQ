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
  console.log('   VITE_SUPABASE_URL=your-url SUPABASE_SERVICE_ROLE_KEY=your-key node reset-superadmin-password.js');
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

// Superadmin credentials
const email = 'jakerains@gmail.com';
const newPassword = 'SuperAdmin2025!'; // New password to set

async function resetSuperadminPassword() {
  console.log('🔄 Resetting Superadmin Password...\n');

  try {
    // 1. Find the user by email
    console.log('1. Finding superadmin user...');
    const { data: userData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    const superadminUser = userData?.users.find(user => user.email === email);
    
    if (!superadminUser) {
      console.error(`❌ No user found with email: ${email}`);
      console.log('Available users:', userData?.users.map(u => u.email));
      return;
    }

    console.log('✅ Superadmin user found!');
    console.log('   User ID:', superadminUser.id);
    console.log('   Email:', superadminUser.email);
    console.log('   Current role:', superadminUser.user_metadata?.role || 'none');

    // 2. Reset the password
    console.log('\n2. Resetting password...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      superadminUser.id,
      {
        password: newPassword,
        user_metadata: {
          ...superadminUser.user_metadata,
          role: 'super_admin',
          full_name: 'Jake Rains'
        }
      }
    );

    if (updateError) {
      console.error('❌ Error resetting password:', updateError.message);
      return;
    }

    console.log('✅ Password reset successfully!');

    // 3. Verify the profile exists and has correct role
    console.log('\n3. Verifying profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', superadminUser.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profile not found, creating one...');
      
      // Create profile if it doesn't exist
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: superadminUser.id,
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

      if (createProfileError) {
        console.error('❌ Error creating profile:', createProfileError.message);
        return;
      }

      console.log('✅ Profile created successfully!');
      console.log('   Profile ID:', newProfile.id);
    } else {
      console.log('✅ Profile verified!');
      console.log('   Profile ID:', profile.id);
      console.log('   Role:', profile.role);
      
      // Update profile to ensure super_admin role if needed
      if (profile.role !== 'super_admin') {
        console.log('\n4. Updating profile role to super_admin...');
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'super_admin',
            full_name: 'Jake Rains',
            organization_id: null // Ensure super admin is not tied to any organization
          })
          .eq('user_id', superadminUser.id);

        if (updateProfileError) {
          console.error('❌ Error updating profile:', updateProfileError.message);
          return;
        }

        console.log('✅ Profile role updated to super_admin!');
      }
    }

    console.log('\n🎉 SUCCESS: Superadmin password reset completed!');
    console.log('📍 Updated Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', newPassword);
    console.log('   Role: super_admin');
    console.log('\n🔗 Access Instructions:');
    console.log('1. Navigate to your app (e.g., http://localhost:5173)');
    console.log('2. Login with the credentials above');
    console.log('3. Access the superadmin dashboard');
    console.log('\n⚠️  SECURITY NOTE: Please change this password after logging in!');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run the script
resetSuperadminPassword(); 