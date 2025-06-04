/*
  # Fix ambiguous user_id references in RLS policies

  1. Changes
    - Update RLS policies to use explicit subqueries for auth.uid()
    - Ensure proper organization access checks
    - Fix ambiguous column references

  2. Security
    - Maintains existing security model
    - Uses explicit subqueries to resolve ambiguity
    - Preserves organization-based access control
*/

-- Drop existing policies to recreate them with fixed queries
DROP POLICY IF EXISTS "Organizations can manage their products" ON products;

-- Recreate the policy with unambiguous user_id references
CREATE POLICY "Organizations can manage their products" ON products
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.user_id = (SELECT auth.uid())
  )
);