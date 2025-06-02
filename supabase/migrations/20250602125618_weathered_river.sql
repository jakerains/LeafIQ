-- Migration: Add Import Functions for Product and Variant data
-- These functions are designed to handle the import of products and variants with conflict handling

-- Function to import a product with conflict handling
CREATE OR REPLACE FUNCTION public.import_product_with_conflict_handling(
  p_id UUID,
  p_organization_id UUID,
  p_name TEXT,
  p_brand TEXT,
  p_category TEXT,
  p_subcategory TEXT = NULL,
  p_description TEXT = NULL,
  p_image_url TEXT = NULL,
  p_strain_type TEXT = NULL
)
RETURNS SETOF public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- First try to update existing product
  UPDATE public.products
  SET 
    name = p_name,
    brand = p_brand,
    category = p_category,
    subcategory = p_subcategory,
    description = p_description,
    image_url = p_image_url,
    strain_type = p_strain_type,
    updated_at = now()
  WHERE id = p_id AND organization_id = p_organization_id;
  
  -- If no product was updated (no matching ID found), insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.products (
      id,
      organization_id,
      name,
      brand,
      category,
      subcategory,
      description,
      image_url,
      strain_type
    ) VALUES (
      p_id,
      p_organization_id,
      p_name,
      p_brand,
      p_category,
      p_subcategory,
      p_description,
      p_image_url,
      p_strain_type
    );
  END IF;
  
  -- Return the updated or inserted product
  RETURN QUERY SELECT * FROM public.products WHERE id = p_id;
END;
$$;

-- Function to import a variant with conflict handling
CREATE OR REPLACE FUNCTION public.import_variant_with_conflict_handling(
  v_id UUID,
  v_product_id UUID,
  v_size_weight TEXT = NULL,
  v_price NUMERIC = 0,
  v_original_price NUMERIC = NULL,
  v_thc_percentage NUMERIC = NULL,
  v_cbd_percentage NUMERIC = NULL,
  v_total_cannabinoids NUMERIC = NULL,
  v_inventory_level INTEGER = 0,
  v_is_available BOOLEAN = true,
  v_terpene_profile JSONB = '{}'::jsonb
)
RETURNS SETOF public.variants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- First try to update existing variant
  UPDATE public.variants
  SET 
    product_id = v_product_id,
    size_weight = v_size_weight,
    price = v_price,
    original_price = COALESCE(v_original_price, v_price),
    thc_percentage = v_thc_percentage,
    cbd_percentage = v_cbd_percentage,
    total_cannabinoids = v_total_cannabinoids,
    inventory_level = v_inventory_level,
    is_available = v_is_available,
    terpene_profile = v_terpene_profile,
    updated_at = now()
  WHERE id = v_id;
  
  -- If no variant was updated (no matching ID found), insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.variants (
      id,
      product_id,
      size_weight,
      price,
      original_price,
      thc_percentage,
      cbd_percentage,
      total_cannabinoids,
      inventory_level,
      is_available,
      terpene_profile
    ) VALUES (
      v_id,
      v_product_id,
      v_size_weight,
      v_price,
      COALESCE(v_original_price, v_price),
      v_thc_percentage,
      v_cbd_percentage,
      v_total_cannabinoids,
      v_inventory_level,
      v_is_available,
      v_terpene_profile
    );
  END IF;
  
  -- Return the updated or inserted variant
  RETURN QUERY SELECT * FROM public.variants WHERE id = v_id;
END;
$$;

-- Add comments to explain the purpose of each function
COMMENT ON FUNCTION public.import_product_with_conflict_handling IS 'Handles importing products with conflict resolution by updating existing products or inserting new ones based on ID and organization_id match';
COMMENT ON FUNCTION public.import_variant_with_conflict_handling IS 'Handles importing variants with conflict resolution by updating existing variants or inserting new ones based on ID match';