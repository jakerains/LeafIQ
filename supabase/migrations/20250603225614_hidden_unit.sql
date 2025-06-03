/*
  # Fix infinite recursion in profiles table RLS policy

  1. Changes
     - Drop existing problematic RLS policies on profiles table
     - Create a security definer function to safely check profile permissions
     - Add new, non-recursive RLS policies for profiles table
  
  2. Security
     - Maintain proper access controls for profile data
     - Prevent infinite recursion in policy evaluation
*/

-- First, drop all existing RLS policies on the profiles table
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create a security definer function to safely check if a user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = check_user_id AND role = 'super_admin'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$;

-- Create a security definer function to get a user's organization IDs
CREATE OR REPLACE FUNCTION get_user_organizations(check_user_id uuid)
RETURNS SETOF uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY 
    SELECT organization_id FROM profiles
    WHERE user_id = check_user_id AND organization_id IS NOT NULL;
END;
$$;

-- Add new RLS policies that don't cause recursion
-- Basic read policy for all authenticated users (no recursion)
CREATE POLICY "Users can read their own profiles"
ON profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for organization members to view profiles in their organization
CREATE POLICY "Organization members can view profiles in their org"
ON profiles FOR SELECT
TO authenticated
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
);

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (is_super_admin(auth.uid()));

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Super admins can manage all profiles
CREATE POLICY "Super admins can manage all profiles"
ON profiles FOR ALL
TO authenticated
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Service role bypass for system operations
CREATE POLICY "Service role bypass"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);