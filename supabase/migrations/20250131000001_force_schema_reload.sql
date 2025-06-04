/*
  # Force PostgREST schema cache reload
  
  This migration makes a small schema change to force PostgREST to reload its schema cache
  and pick up the organizations table structure properly.
*/

-- Add a comment to force schema reload
COMMENT ON TABLE organizations IS 'Dispensary organizations with subscription and plan information';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema'; 