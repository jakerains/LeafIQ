/*
  # Fix infinite recursion in profiles RLS policies
  
  1. Changes
    - Fixes the "Super admins can manage all profiles" policy to prevent infinite recursion
    - Modifies the policy to use a subquery with auth.uid() to prevent repeated evaluation
    - Ensures other policies also use the subquery pattern for consistency
  
  2. Security
    - Maintains the same security rules but prevents recursion errors
    - All existing permissions remain unchanged
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;

-- Recreate the policy with fixed subquery for auth.uid()
CREATE POLICY "Super admins can manage all profiles" 
ON public.profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles admin_profile
    WHERE (
      admin_profile.user_id = (SELECT auth.uid()) AND 
      admin_profile.role = 'super_admin'
    )
  )
);

-- Fix other policies that use uid() directly
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));