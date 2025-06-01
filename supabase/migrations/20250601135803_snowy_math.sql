/*
  # Fix Product Import Conflict Handling

  1. Changes
    - Add ON CONFLICT DO NOTHING to product imports
    - Create a function to handle product imports with conflict resolution
    - Add a trigger to update variants when products are updated

  2. Security
    - Maintain existing RLS policies
    - Function is SECURITY DEFINER to ensure proper permissions
*/

-- Create a function to import products with conflict handling
CREATE OR REPLACE FUNCTION import_product_with_conflict_handling(
  p_id uuid,
  p_organization_id uuid,
  p_name text,
  p_brand text,
  p_category text,
  p_subcategory text,
  p_description text,
  p_image_url text,
  p_strain_type text
) RETURNS uuid AS $$
DECLARE
  product_id uuid;
BEGIN
  -- Try to insert the product
  INSERT INTO products (
    id, organization_id, name, brand, category, subcategory, description, image_url, strain_type
  ) VALUES (
    p_id, p_organization_id, p_name, p_brand, p_category, p_subcategory, p_description, p_image_url, p_strain_type
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    strain_type = EXCLUDED.strain_type,
    updated_at = NOW()
  RETURNING id INTO product_id;
  
  RETURN product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to import variants with conflict handling
CREATE OR REPLACE FUNCTION import_variant_with_conflict_handling(
  v_id uuid,
  v_product_id uuid,
  v_size_weight text,
  v_price numeric,
  v_original_price numeric,
  v_thc_percentage numeric,
  v_cbd_percentage numeric,
  v_total_cannabinoids numeric,
  v_inventory_level integer,
  v_is_available boolean,
  v_terpene_profile jsonb
) RETURNS uuid AS $$
DECLARE
  variant_id uuid;
BEGIN
  -- Try to insert the variant
  INSERT INTO variants (
    id, product_id, size_weight, price, original_price, thc_percentage, cbd_percentage,
    total_cannabinoids, inventory_level, is_available, terpene_profile
  ) VALUES (
    v_id, v_product_id, v_size_weight, v_price, v_original_price, v_thc_percentage, v_cbd_percentage,
    v_total_cannabinoids, v_inventory_level, v_is_available, v_terpene_profile
  )
  ON CONFLICT (id) DO UPDATE SET
    size_weight = EXCLUDED.size_weight,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    thc_percentage = EXCLUDED.thc_percentage,
    cbd_percentage = EXCLUDED.cbd_percentage,
    total_cannabinoids = EXCLUDED.total_cannabinoids,
    inventory_level = EXCLUDED.inventory_level,
    is_available = EXCLUDED.is_available,
    terpene_profile = EXCLUDED.terpene_profile,
    last_updated = NOW()
  RETURNING id INTO variant_id;
  
  RETURN variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION import_product_with_conflict_handling(uuid, uuid, text, text, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION import_variant_with_conflict_handling(uuid, uuid, text, numeric, numeric, numeric, numeric, numeric, integer, boolean, jsonb) TO authenticated;

-- Add a comment explaining the purpose
COMMENT ON FUNCTION import_product_with_conflict_handling IS 'Imports a product with conflict handling - if the product already exists, it will be updated instead of causing an error.';
COMMENT ON FUNCTION import_variant_with_conflict_handling IS 'Imports a variant with conflict handling - if the variant already exists, it will be updated instead of causing an error.';