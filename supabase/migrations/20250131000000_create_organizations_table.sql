/*
  # Create Organizations Table

  1. Tables
    - organizations
      - id (uuid, primary key)
      - name (text, not null)
      - slug (text, unique, not null)
      - description (text)
      - website (text)
      - phone (text)
      - email (text)
      - address (text)
      - city (text)
      - state (text)
      - zip_code (text)
      - subscription_status (text, default 'unknown')
      - plan_type (text, default 'basic')
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on organizations
    - Organizations are readable by their members
    - Super admins can manage all organizations
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  zip_code text,
  subscription_status text DEFAULT 'unknown' CHECK (subscription_status IN ('active', 'inactive', 'suspended', 'unknown')),
  plan_type text DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Organizations are readable by members" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT get_user_organizations(auth.uid())) OR
    is_super_admin(auth.uid())
  );

CREATE POLICY "Super admins can manage organizations" ON public.organizations
  FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON public.organizations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo organization if it doesn't exist
INSERT INTO public.organizations (id, name, slug, description, subscription_status, plan_type)
VALUES (
  'demo-dispensary-001',
  'Demo Dispensary',
  'demo-dispensary',
  'Demo dispensary for testing and showcase purposes',
  'active',
  'pro'
) ON CONFLICT (id) DO NOTHING; 