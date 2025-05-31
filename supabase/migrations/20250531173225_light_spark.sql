/*
  # Fix search queries policy infinite recursion

  1. Changes
    - Update the RLS policy for search_queries table to prevent infinite recursion
    - Add a simpler policy that doesn't reference the profiles table in a circular way
*/

-- Drop the problematic policy that's causing infinite recursion
DROP POLICY IF EXISTS "Users can view search queries in their organization" ON public.search_queries;

-- Create a new policy that doesn't cause recursion
CREATE POLICY "Users can view search queries by organization_id" 
ON public.search_queries
FOR SELECT
TO public
USING (organization_id = auth.jwt() -> 'organization_id' OR organization_id IS NULL);

-- Create a policy for inserting search queries
CREATE POLICY "Anyone can insert search queries" 
ON public.search_queries
FOR INSERT
TO public
WITH CHECK (true);