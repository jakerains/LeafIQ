-- Create Demo Dispensary Organization and User
-- This allows users to test the system with a real authentication setup

-- First, create the demo organization
INSERT INTO organizations (id, name, subscription_tier, created_at, updated_at)
VALUES (
  'd85af8c9-0d4a-451c-bc25-8c669c71142e',
  'Demo Dispensary',
  'trial',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Note: The demo user will be created through Supabase Auth with:
-- Email: demo@leafiq.com
-- Password: demo1234
-- This should be created manually in the Supabase Auth dashboard
-- or through the signup process

-- Create a profile for the demo user (we'll use a known UUID)
-- In a real setup, this would be created automatically via trigger when user signs up
INSERT INTO profiles (id, user_id, organization_id, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'demo-user-uuid', -- This will be replaced with the actual auth user UUID
  'd85af8c9-0d4a-451c-bc25-8c669c71142e',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  organization_id = EXCLUDED.organization_id,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Add a comment explaining the setup
COMMENT ON TABLE organizations IS 'Demo organization "Demo Dispensary" with ID d85af8c9-0d4a-451c-bc25-8c669c71142e is available for testing. Demo user should be created with email demo@leafiq.com and linked to this organization.'; 