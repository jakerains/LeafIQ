import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createStaffDemoUser() {
  console.log('Creating staff demo user...');
  
  try {
    // Create the user with metadata
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'staff@leafiq.online',
      password: 'staff1234',
      email_confirm: true,
      user_metadata: {
        organization: 'Demo Dispensary',
        slug: 'demo-dispensary',
        role: 'staff',
        useMode: 'both',
        menuSource: 'manual',
        enableDemoInventory: true,
        fullName: 'Demo Staff',
        wantOnboardingHelp: false
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('User created successfully:', authData.user.id);
    
    // The trigger should automatically create the profile, but let's verify
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds for trigger
    
    // Check if profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('user_id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      
      // If profile wasn't created by trigger, create it manually
      console.log('Creating profile manually...');
      
      const demoOrgId = 'd85af8c9-0d4a-451c-bc25-8c669c71142e';
      
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          organization_id: demoOrgId,
          role: 'staff',
          use_mode: 'both',
          menu_source: 'manual',
          enable_demo_inventory: true,
          full_name: 'Demo Staff',
          wants_onboarding: false
        });
      
      if (createError) {
        console.error('Error creating profile:', createError);
      } else {
        console.log('Profile created successfully');
      }
    } else {
      console.log('Profile created by trigger:', profile);
      
      // Update profile to ensure it's linked to demo organization and has staff role
      const demoOrgId = 'd85af8c9-0d4a-451c-bc25-8c669c71142e';
      
      if (profile.organization_id !== demoOrgId || profile.role !== 'staff') {
        console.log('Updating profile to use demo organization with staff role...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            organization_id: demoOrgId,
            role: 'staff'
          })
          .eq('user_id', authData.user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('Profile updated successfully');
        }
      }
    }
    
    console.log('\n✅ Staff demo user created successfully!');
    console.log('Email: staff@leafiq.online');
    console.log('Password: staff1234');
    console.log('Role: staff');
    console.log('Organization: Demo Dispensary');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
createStaffDemoUser(); 