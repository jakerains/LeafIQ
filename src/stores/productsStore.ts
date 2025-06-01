import { create } from 'zustand';
import { Product, Variant, ProductWithVariant } from '../types';
import { supabase } from '../lib/supabase';
import { recommendProducts } from '../utils/recommendationEngine';
import { useSimpleAuthStore } from './simpleAuthStore';

interface ProductsState {
  products: Product[];
  variants: Variant[];
  isLoading: boolean;
  error: string | null;
  
  // Combined product and variant data for easier consumption
  productsWithVariants: ProductWithVariant[];
  
  // Actions
  fetchProducts: () => Promise<void>;
  searchProductsByVibe: (vibe: string, userType?: 'kiosk' | 'staff') => Promise<{
    products: ProductWithVariant[];
    effects: string[];
    isAIPowered: boolean;
  }>;
  
  // Real-time inventory access for Bud
  getAvailableProducts: (organizationId: string) => Promise<ProductWithVariant[]>;
  searchProductsByQuery: (query: string, organizationId: string) => Promise<ProductWithVariant[]>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  variants: [],
  isLoading: false,
  error: null,
  productsWithVariants: [],
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get the current user's organization
      const { organizationId } = useSimpleAuthStore.getState();
      if (!organizationId) {
        throw new Error('No organization found for user');
      }

      // Fetch products from Supabase
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (productsError) throw productsError;

      // Fetch variants from Supabase
      const { data: variants, error: variantsError } = await supabase
        .from('variants')
        .select('*')
        .in('product_id', products?.map(p => p.id) || [])
        .order('price');

      if (variantsError) throw variantsError;

      // Combine products with their variants
      const productsWithVariants: ProductWithVariant[] = (products || []).map(product => {
        const productVariants = (variants || []).filter(v => v.product_id === product.id);
        const firstVariant = productVariants[0];
        
        if (!firstVariant) return null;
        
        return {
          ...product,
          variant: firstVariant
        };
      }).filter(Boolean) as any;
      
      set({ 
        products: products as any || [], 
        variants: variants as any || [], 
        productsWithVariants: productsWithVariants as any,
        isLoading: false 
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch products' 
      });
    }
  },
  
  searchProductsByVibe: async (vibe: string, userType: 'kiosk' | 'staff' = 'kiosk') => {
    set({ isLoading: true, error: null });
    
    try {
      const { productsWithVariants } = get();
      
      if (productsWithVariants.length === 0) {
        await get().fetchProducts();
      }

      // Get the organization ID from the auth store
      const { organizationId } = useSimpleAuthStore.getState();
      
      // Use the enhanced recommendation engine with AI capabilities
      const results = await recommendProducts(
        get().productsWithVariants, 
        vibe, 
        userType, 
        3,
        organizationId // Pass the organization ID to the recommendation engine
      );
      
      set({ isLoading: false });
      return results;
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to search products' 
      });
      
      // Return empty results in case of error
      return { products: [], effects: [], isAIPowered: false };
    }
  },

  // Real-time inventory access for Bud
  getAvailableProducts: async (organizationId: string) => {
    try {
      // Use the database function for optimized query
      const { data, error } = await supabase
        .rpc('get_available_products', { org_id: organizationId });

      if (error) throw error;

      // Transform the data to match ProductWithVariant interface
      const productsWithVariants: ProductWithVariant[] = (data || []).map((item: any) => ({
        id: item.product_id,
        organization_id: organizationId,
        name: item.product_name,
        brand: item.brand,
        category: item.category,
        subcategory: null,
        description: '',
        image_url: '',
        strain_type: item.strain_type,
        thc_percentage: item.thc_percentage,
        cbd_percentage: item.cbd_percentage,
        price: item.price,
        created_at: '',
        updated_at: '',
        variant: {
          id: item.variant_id,
          product_id: item.product_id,
          size_weight: '',
          price: item.price,
          original_price: null,
          thc_percentage: item.thc_percentage,
          cbd_percentage: item.cbd_percentage,
          total_cannabinoids: null,
          terpene_profile: item.terpene_profile || {},
          inventory_level: item.inventory_level,
          is_available: true,
          last_updated: '',
          created_at: ''
        }
      }));

      return productsWithVariants;
    } catch (err) {
      console.error('Error fetching available products:', err);
      return [];
    }
  },

  // Search products by text query for Bud
  searchProductsByQuery: async (query: string, organizationId: string) => {
    try {
      const lowerQuery = query.toLowerCase();
      
      // Fetch products that match the search query
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          variants!inner(*)
        `)
        .eq('organization_id', organizationId)
        .eq('variants.is_available', true)
        .gt('variants.inventory_level', 0)
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%,strain_type.ilike.%${query}%,description.ilike.%${query}%`);

      if (productsError) throw productsError;

      // Transform to ProductWithVariant format
      const productsWithVariants: ProductWithVariant[] = (products || []).map(product => ({
        ...product,
        variant: product.variants[0] // Take the first available variant
      }));

      return productsWithVariants;
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  }
}));