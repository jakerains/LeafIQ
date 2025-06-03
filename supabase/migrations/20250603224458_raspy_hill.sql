-- Add super_admin to the role check constraint in profiles table
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
    -- If the constraint exists, drop it and recreate it
    ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role = ANY (ARRAY['staff'::text, 'admin'::text, 'super_admin'::text]));
  END IF;
END
$$;

-- Create view for super_admin users without email field
CREATE OR REPLACE VIEW super_admins AS
SELECT 
  profiles.id,
  profiles.user_id,
  profiles.organization_id,
  profiles.full_name,
  profiles.created_at
FROM profiles
WHERE profiles.role = 'super_admin';

-- Update RLS policies to give super_admin full access to profiles
CREATE POLICY "Super admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles AS admin_profile
    WHERE admin_profile.user_id = auth.uid()
    AND admin_profile.role = 'super_admin'
  )
);

-- Create a function to check if a user is a super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$;

-- Create a table to store Pinecone documents for ingestion
-- First, ensure the pgvector extension is available
CREATE EXTENSION IF NOT EXISTS vector;

-- Now create the table with the vector type
CREATE TABLE IF NOT EXISTS pinecone_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source text,
  category text,
  embedding vector(1024),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  ingested_at timestamptz,
  status text DEFAULT 'pending'
);

-- Add RLS policies to pinecone_documents table
ALTER TABLE pinecone_documents ENABLE ROW LEVEL SECURITY;

-- Only super_admins can manage Pinecone documents
CREATE POLICY "Super admins can manage Pinecone documents"
ON pinecone_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles AS admin_profile
    WHERE admin_profile.user_id = auth.uid()
    AND admin_profile.role = 'super_admin'
  )
);

-- Regular users can view Pinecone documents
CREATE POLICY "All users can view Pinecone documents"
ON pinecone_documents
FOR SELECT
TO authenticated
USING (true);