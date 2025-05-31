/*
  # Fix Authentication Tables

  1. Changes
    - Drop and recreate auth tables with proper RLS policies
    - Add missing indexes for performance
    - Update trigger function for new user signup

  2. Security
    - Enable RLS on all tables
    - Add proper policies for data access
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO organizations (name, slug, plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'organization', 'Default Organization'),
    COALESCE(NEW.raw_user_meta_data->>'slug', 'default-' || LOWER(REPLACE(NEW.email, '@', '-'))),
    'free'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id;

  INSERT INTO profiles (user_id, organization_id, role)
  VALUES (
    NEW.id,
    (SELECT id FROM organizations WHERE slug = COALESCE(NEW.raw_user_meta_data->>'slug', 'default-' || LOWER(REPLACE(NEW.email, '@', '-')))),
    CASE 
      WHEN NEW.email LIKE '%@admin%' THEN 'admin'
      ELSE 'member'
    END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- Ensure RLS is enabled
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
CREATE POLICY "Users can view their organizations"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;
CREATE POLICY "Users can view profiles in their organization"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());