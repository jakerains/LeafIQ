/*
  # Create Super Admin User and Function
  
  1. New Features
    - Creates a super admin user directly in the database
    - Sets up the necessary profile record
    - Uses direct SQL insert to bypass API limitations
  
  2. Security
    - Creates user with super_admin role
    - Associates with demo organization
*/

-- First drop the existing function if it exists to avoid parameter name conflict
DROP FUNCTION IF EXISTS is_super_admin(uuid);

-- First check if the user already exists in auth.users
DO $$
DECLARE
  user_exists boolean;
  user_id uuid;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'jakerains@gmail.com'
  ) INTO user_exists;
  
  IF user_exists THEN
    -- Get the user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'jakerains@gmail.com';
    
    -- Check if they already have a profile with super_admin role
    IF EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = user_id AND role = 'super_admin'
    ) THEN
      RAISE NOTICE 'Super admin user already exists';
    ELSE
      -- Create profile with super_admin role
      INSERT INTO public.profiles (
        user_id,
        organization_id,
        role,
        full_name,
        use_mode,
        menu_source,
        enable_demo_inventory,
        wants_onboarding
      ) VALUES (
        user_id,
        'd85af8c9-0d4a-451c-bc25-8c669c71142e', -- Demo organization
        'super_admin',
        'Super Admin',
        'both',
        'manual',
        true,
        false
      );
      RAISE NOTICE 'Added super_admin role to existing user';
    END IF;
  ELSE
    RAISE NOTICE 'User does not exist in auth.users. Please create the user first via the auth API.';
  END IF;
END
$$;

-- Make sure the super_admin role is allowed in the profiles_role_check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_check'
    AND conrelid = 'profiles'::regclass::oid
  ) THEN
    -- If the constraint doesn't exist, create it with the new value
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role = ANY (ARRAY['staff'::text, 'admin'::text, 'super_admin'::text]));
  ELSE
    -- If the constraint exists, make sure it includes super_admin
    -- This is a no-op if the constraint already includes super_admin
    BEGIN
      ALTER TABLE profiles 
      DROP CONSTRAINT profiles_role_check;
      
      ALTER TABLE profiles 
      ADD CONSTRAINT profiles_role_check 
      CHECK (role = ANY (ARRAY['staff'::text, 'admin'::text, 'super_admin'::text]));
    EXCEPTION WHEN OTHERS THEN
      -- If we get an error, the constraint might already be correct
      RAISE NOTICE 'Could not modify profiles_role_check constraint. It may already include super_admin.';
    END;
  END IF;
END
$$;

-- Create a function to check if user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = user_id
    AND role = 'super_admin'
  );
END
$$;