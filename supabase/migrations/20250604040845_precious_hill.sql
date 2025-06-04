/*
  # Fix Super Admin Function and Policies
  
  1. Changes
    - Drops dependent policies before dropping the function
    - Recreates the function with proper parameter naming
    - Adds super_admin to role check constraint
    - Recreates policies that depend on the function
*/

-- First drop the dependent policies that use the is_super_admin function
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;

-- Now we can safely drop the function
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

-- Recreate the policies that depend on the function
CREATE POLICY "Super admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (is_super_admin(auth.uid()));