import { supabase } from '../lib/supabase';
import { Product, Variant } from '../types';

export interface ImportMetadata {
  format_version: string;
  organization_id: string;
  timestamp?: string;
}

export interface ImportVariant {
  id: string;
  size_weight: string;
  price: number;
  original_price?: number;
  thc_percentage?: number;
  cbd_percentage?: number;
  total_cannabinoids?: number;
  inventory_level: number;
  is_available: boolean;
  terpene_profile?: Record<string, number>;
}

export interface ImportProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description?: string;
  image_url?: string;
  strain_type?: 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced';
  variants: ImportVariant[];
}

export interface ImportData {
  metadata: ImportMetadata;
  products: ImportProduct[];
}

export interface ImportResult {
  success: boolean;
  message: string;
  stats?: {
    productsProcessed: number;
    variantsProcessed: number;
    productsCreated: number;
    productsUpdated: number;
    variantsCreated: number;
    variantsUpdated: number;
    errors: string[];
  };
}

/**
 * Validate the JSON structure before importing
 */
export function validateImportData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check top-level structure
  if (!data || typeof data !== 'object') {
    errors.push('Invalid JSON structure');
    return { valid: false, errors };
  }

  // Check metadata
  if (!data.metadata) {
    errors.push('Missing metadata section');
  } else {
    if (!data.metadata.format_version) {
      errors.push('Missing format_version in metadata');
    }
    if (!data.metadata.organization_id) {
      errors.push('Missing organization_id in metadata');
    }
  }

  // Check products array
  if (!data.products || !Array.isArray(data.products)) {
    errors.push('Missing or invalid products array');
    return { valid: false, errors };
  }

  if (data.products.length === 0) {
    errors.push('Products array is empty');
  }

  // Validate each product
  data.products.forEach((product: any, index: number) => {
    const productPrefix = `Product ${index + 1}`;

    if (!product.id) {
      errors.push(`${productPrefix}: Missing id`);
    }
    if (!product.name) {
      errors.push(`${productPrefix}: Missing name`);
    }
    if (!product.brand) {
      errors.push(`${productPrefix}: Missing brand`);
    }
    if (!product.category) {
      errors.push(`${productPrefix}: Missing category`);
    }

    // Validate variants
    if (!product.variants || !Array.isArray(product.variants)) {
      errors.push(`${productPrefix}: Missing or invalid variants array`);
    } else if (product.variants.length === 0) {
      errors.push(`${productPrefix}: Must have at least one variant`);
    } else {
      product.variants.forEach((variant: any, variantIndex: number) => {
        const variantPrefix = `${productPrefix}, Variant ${variantIndex + 1}`;

        if (!variant.id) {
          errors.push(`${variantPrefix}: Missing id`);
        }
        if (!variant.size_weight) {
          errors.push(`${variantPrefix}: Missing size_weight`);
        }
        if (typeof variant.price !== 'number' || variant.price < 0) {
          errors.push(`${variantPrefix}: Invalid price`);
        }
        if (typeof variant.inventory_level !== 'number' || variant.inventory_level < 0) {
          errors.push(`${variantPrefix}: Invalid inventory_level`);
        }
        if (typeof variant.is_available !== 'boolean') {
          errors.push(`${variantPrefix}: Invalid is_available (must be boolean)`);
        }
      });
    }
  });

  return { valid: errors.length === 0, errors };
}

export type ImportMode = 'update' | 'replace';

/**
 * Import inventory data from JSON into Supabase
 */
export async function importInventoryData(
  data: ImportData,
  organizationId: string,
  mode: ImportMode = 'update'
): Promise<ImportResult> {
  const stats = {
    productsProcessed: 0,
    variantsProcessed: 0,
    productsCreated: 0,
    productsUpdated: 0,
    variantsCreated: 0,
    variantsUpdated: 0,
    errors: [] as string[]
  };

  try {
    // Validate the data first
    const validation = validateImportData(data);
    if (!validation.valid) {
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join(', ')}`,
        stats
      };
    }

    // Verify organization ID matches
    if (data.metadata.organization_id !== organizationId) {
      return {
        success: false,
        message: 'Organization ID in JSON does not match your account',
        stats
      };
    }

    // If replacing existing, delete all current products for this organization
    if (mode === 'replace') {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('organization_id', organizationId);

      if (deleteError) {
        throw new Error(`Failed to clear existing inventory: ${deleteError.message}`);
      }
    }

    // Process each product
    for (const importProduct of data.products) {
      stats.productsProcessed++;

      try {
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('id', importProduct.id)
          .eq('organization_id', organizationId)
          .single();

        let productId = importProduct.id;

        if (existingProduct) {
          // Update existing product
          const { error: updateError } = await supabase
            .from('products')
            .update({
              name: importProduct.name,
              brand: importProduct.brand,
              category: importProduct.category,
              subcategory: importProduct.subcategory,
              description: importProduct.description,
              image_url: importProduct.image_url,
              strain_type: importProduct.strain_type,
              updated_at: new Date().toISOString()
            })
            .eq('id', importProduct.id)
            .eq('organization_id', organizationId);

          if (updateError) {
            stats.errors.push(`Failed to update product ${importProduct.name}: ${updateError.message}`);
            continue;
          }

          stats.productsUpdated++;
        } else {
          // Create new product
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              id: importProduct.id,
              organization_id: organizationId,
              name: importProduct.name,
              brand: importProduct.brand,
              category: importProduct.category,
              subcategory: importProduct.subcategory,
              description: importProduct.description,
              image_url: importProduct.image_url,
              strain_type: importProduct.strain_type,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            stats.errors.push(`Failed to create product ${importProduct.name}: ${insertError.message}`);
            continue;
          }

          stats.productsCreated++;
        }

        // Process variants for this product
        for (const importVariant of importProduct.variants) {
          stats.variantsProcessed++;

          try {
            // Check if variant already exists
            const { data: existingVariant } = await supabase
              .from('variants')
              .select('id')
              .eq('id', importVariant.id)
              .eq('product_id', productId)
              .single();

            if (existingVariant) {
              // Update existing variant
              const { error: updateError } = await supabase
                .from('variants')
                .update({
                  size_weight: importVariant.size_weight,
                  price: importVariant.price,
                  original_price: importVariant.original_price || importVariant.price,
                  thc_percentage: importVariant.thc_percentage,
                  cbd_percentage: importVariant.cbd_percentage,
                  total_cannabinoids: importVariant.total_cannabinoids,
                  terpene_profile: importVariant.terpene_profile || {},
                  inventory_level: importVariant.inventory_level,
                  is_available: importVariant.is_available,
                  last_updated: new Date().toISOString()
                })
                .eq('id', importVariant.id)
                .eq('product_id', productId);

              if (updateError) {
                stats.errors.push(`Failed to update variant ${importVariant.id}: ${updateError.message}`);
                continue;
              }

              stats.variantsUpdated++;
            } else {
              // Create new variant
              const { error: insertError } = await supabase
                .from('variants')
                .insert({
                  id: importVariant.id,
                  product_id: productId,
                  size_weight: importVariant.size_weight,
                  price: importVariant.price,
                  original_price: importVariant.original_price || importVariant.price,
                  thc_percentage: importVariant.thc_percentage,
                  cbd_percentage: importVariant.cbd_percentage,
                  total_cannabinoids: importVariant.total_cannabinoids,
                  terpene_profile: importVariant.terpene_profile || {},
                  inventory_level: importVariant.inventory_level,
                  is_available: importVariant.is_available,
                  created_at: new Date().toISOString(),
                  last_updated: new Date().toISOString()
                });

              if (insertError) {
                stats.errors.push(`Failed to create variant ${importVariant.id}: ${insertError.message}`);
                continue;
              }

              stats.variantsCreated++;
            }
          } catch (variantError) {
            stats.errors.push(`Error processing variant ${importVariant.id}: ${variantError}`);
          }
        }
      } catch (productError) {
        stats.errors.push(`Error processing product ${importProduct.name}: ${productError}`);
      }
    }

    const hasErrors = stats.errors.length > 0;
    const message = hasErrors
      ? `Import completed with ${stats.errors.length} errors. ${stats.productsCreated + stats.productsUpdated} products and ${stats.variantsCreated + stats.variantsUpdated} variants processed.`
      : `Import successful! Created ${stats.productsCreated} products and ${stats.variantsCreated} variants. Updated ${stats.productsUpdated} products and ${stats.variantsUpdated} variants.`;

    return {
      success: !hasErrors || (stats.productsCreated + stats.productsUpdated > 0),
      message,
      stats
    };

  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stats
    };
  }
}

/**
 * Export current inventory to JSON format
 */
export async function exportInventoryData(organizationId: string): Promise<ImportData | null> {
  try {
    // Fetch all products for the organization
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      return null;
    }

    // Fetch all variants for these products
    const productIds = products.map(p => p.id);
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .in('product_id', productIds)
      .order('price');

    if (variantsError) {
      throw new Error(`Failed to fetch variants: ${variantsError.message}`);
    }

    // Group variants by product
    const variantsByProduct = (variants || []).reduce((acc: Record<string, any[]>, variant: any) => {
      if (!acc[variant.product_id]) {
        acc[variant.product_id] = [];
      }
      acc[variant.product_id].push(variant);
      return acc;
    }, {} as Record<string, any[]>);

    // Build the export data
    const exportData: ImportData = {
      metadata: {
        format_version: '1.0',
        organization_id: organizationId,
        timestamp: new Date().toISOString()
      },
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        image_url: product.image_url,
        strain_type: product.strain_type,
        variants: (variantsByProduct[product.id] || []).map(variant => ({
          id: variant.id,
          size_weight: variant.size_weight,
          price: variant.price,
          original_price: variant.original_price,
          thc_percentage: variant.thc_percentage,
          cbd_percentage: variant.cbd_percentage,
          total_cannabinoids: variant.total_cannabinoids,
          inventory_level: variant.inventory_level,
          is_available: variant.is_available,
          terpene_profile: variant.terpene_profile || {}
        }))
      }))
    };

    return exportData;

  } catch (error) {
    console.error('Export failed:', error);
    return null;
  }
} 