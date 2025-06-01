/*
  # Create Products and Variants Tables

  1. New Tables
    - `products`: Main product information
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `name` (text)
      - `brand` (text)
      - `category` (text)
      - `subcategory` (text)
      - `description` (text)
      - `image_url` (text)
      - `strain_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `variants`: Product variants with pricing and inventory
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `size_weight` (text)
      - `price` (decimal)
      - `original_price` (decimal)
      - `thc_percentage` (decimal)
      - `cbd_percentage` (decimal)
      - `total_cannabinoids` (decimal)
      - `terpene_profile` (jsonb)
      - `inventory_level` (integer)
      - `is_available` (boolean)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for organization-based access
    - Add indexes for performance

  3. Functions
    - Add trigger to update `updated_at` timestamps
    - Add function to check inventory levels
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  image_url text,
  strain_type text CHECK (strain_type IN ('indica', 'sativa', 'hybrid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create variants table
CREATE TABLE IF NOT EXISTS variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size_weight text,
  price decimal(10,2),
  original_price decimal(10,2),
  thc_percentage decimal(5,2),
  cbd_percentage decimal(5,2),
  total_cannabinoids decimal(5,2),
  terpene_profile jsonb DEFAULT '{}',
  inventory_level integer DEFAULT 0,
  is_available boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Users can view products in their organization"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage products in their organization"
  ON products
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Variants policies
CREATE POLICY "Users can view variants for products in their organization"
  ON variants
  FOR SELECT
  TO authenticated
  USING (
    product_id IN (
      SELECT p.id 
      FROM products p
      JOIN profiles pr ON p.organization_id = pr.organization_id
      WHERE pr.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage variants for products in their organization"
  ON variants
  FOR ALL
  TO authenticated
  USING (
    product_id IN (
      SELECT p.id 
      FROM products p
      JOIN profiles pr ON p.organization_id = pr.organization_id
      WHERE pr.user_id = auth.uid() AND pr.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id 
      FROM products p
      JOIN profiles pr ON p.organization_id = pr.organization_id
      WHERE pr.user_id = auth.uid() AND pr.role IN ('admin', 'staff')
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at
  BEFORE UPDATE ON variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for variants last_updated
CREATE TRIGGER update_variants_last_updated
  BEFORE UPDATE ON variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_organization_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_strain_type ON products(strain_type);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_is_available ON variants(is_available);
CREATE INDEX IF NOT EXISTS idx_variants_inventory_level ON variants(inventory_level);
CREATE INDEX IF NOT EXISTS idx_variants_thc_percentage ON variants(thc_percentage);
CREATE INDEX IF NOT EXISTS idx_variants_terpene_profile ON variants USING GIN(terpene_profile);

-- Create function to get available products with inventory
CREATE OR REPLACE FUNCTION get_available_products(org_id uuid)
RETURNS TABLE (
  product_id uuid,
  product_name text,
  brand text,
  category text,
  strain_type text,
  variant_id uuid,
  price decimal,
  thc_percentage decimal,
  cbd_percentage decimal,
  inventory_level integer,
  terpene_profile jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    p.category,
    p.strain_type,
    v.id as variant_id,
    v.price,
    v.thc_percentage,
    v.cbd_percentage,
    v.inventory_level,
    v.terpene_profile
  FROM products p
  JOIN variants v ON p.id = v.product_id
  WHERE p.organization_id = org_id
    AND v.is_available = true
    AND v.inventory_level > 0
  ORDER BY p.name, v.price;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_available_products(uuid) TO authenticated; 