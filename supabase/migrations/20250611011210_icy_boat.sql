/*
  # Create Waitlist Signups Table

  1. New Tables
    - waitlist_signups
      - id (uuid, primary key)
      - email (text, not null, unique)
      - created_at (timestamptz)
      - source (text)
      - notes (text)
  
  2. Security
    - Enable RLS on waitlist_signups table
    - Only super_admin can access and manage waitlist signups
*/

-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'website',
  notes text
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage waitlist signups
CREATE POLICY "Super admins can manage waitlist signups"
ON public.waitlist_signups
FOR ALL
TO authenticated
USING (is_super_admin(auth.uid()));

-- Comment on table for documentation
COMMENT ON TABLE public.waitlist_signups IS 'Stores email addresses of users who signed up for the waitlist';