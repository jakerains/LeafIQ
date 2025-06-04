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
    personalizedMessage?: string;
    contextFactors?: string[];
    totalAvailable?: number;
  }>;
  
  // Real-time inventory access for Bud
  getAvailableProducts: (organizationId: string) => Promise<ProductWithVariant[]>;
  searchProductsByQuery: (query: string, organizationId: string) => Promise<ProductWithVariant[]>;
  
  // Clear products when auth changes
  clearProducts: () => void;
  
  // New method for getting more recommendations
  getMoreRecommendations: (vibe: string, offset: number, userType?: 'kiosk' | 'staff') => Promise<{
    products: ProductWithVariant[];
    effects: string[];
    isAIPowered: boolean;
    totalAvailable?: number;
  }>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  variants: [],
  isLoading: false,
  error: null,
  productsWithVariants: [],
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    console.log('🔍 fetchProducts called');
    
    try {
      // Get the current user's organization
      const { organizationId, isAuthenticated, isInitialized } = useSimpleAuthStore.getState();
      
      // Wait for auth to be initialized
      if (!isInitialized) {
        console.log('⏳ Auth not initialized yet, skipping fetch');
        set({ isLoading: false });
        return;
      }
      
      if (!isAuthenticated) {
        console.log('❌ User not authenticated, clearing products');
        set({ 
          products: [],
          variants: [],
          productsWithVariants: [],
          isLoading: false 
        });
        return;
      }
      
      if (!organizationId) {
        console.error('❌ No organization found for user');
        set({ 
          isLoading: false, 
          error: 'No organization found for user' 
        });
        return;
      }

      console.log(`📦 Fetching products for organization: ${organizationId}`);
      
      // Fetch products from Supabase
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name');

      if (productsError) {
        console.error('❌ Error fetching products:', productsError);
        throw productsError;
      }
      
      console.log(`✅ Fetched ${products?.length || 0} products`);

      // Fetch variants from Supabase
      const { data: variants, error: variantsError } = await supabase
        .from('variants')
        .select('*')
        .in('product_id', products?.map(p => p.id) || [])
        .order('price');

      if (variantsError) {
        console.error('❌ Error fetching variants:', variantsError);
        throw variantsError;
      }
      
      console.log(`✅ Fetched ${variants?.length || 0} variants`);

      // Group variants by product for easier access
      const variantsByProduct = (variants || []).reduce((acc: Record<string, Variant[]>, variant: any) => {
        if (!acc[variant.product_id]) {
          acc[variant.product_id] = [];
        }
        // Convert database types to our interface types
        const typedVariant: Variant = {
          id: variant.id,
          product_id: variant.product_id,
          size_weight: variant.size_weight ?? undefined,
          price: variant.price ?? 0,
          original_price: variant.original_price ?? undefined,
          thc_percentage: variant.thc_percentage ?? 0, // Required field
          cbd_percentage: variant.cbd_percentage ?? undefined,
          total_cannabinoids: variant.total_cannabinoids ?? undefined,
          terpene_profile: variant.terpene_profile ?? {},
          inventory_level: variant.inventory_level ?? 0,
          is_available: variant.is_available ?? false,
          batch_number: variant.batch_number ?? undefined,
          harvest_date: variant.harvest_date ?? undefined,
          expiration_date: variant.expiration_date ?? undefined,
          lab_tested: variant.lab_tested ?? undefined,
          created_at: variant.created_at ?? '',
          updated_at: variant.updated_at ?? ''
        };
        acc[variant.product_id].push(typedVariant);
        return acc;
      }, {});

      // Create combined products with variants
      const productsWithVariants: ProductWithVariant[] = (products || []).map((product: any) => {
        const productVariants = variantsByProduct[product.id] || [];
        const firstVariant = productVariants[0] || {
          id: '',
          product_id: product.id,
          size_weight: undefined,
          price: 0,
          original_price: undefined,
          thc_percentage: 0, // Required field
          cbd_percentage: undefined,
          total_cannabinoids: undefined,
          terpene_profile: {},
          inventory_level: 0,
          is_available: false,
          batch_number: undefined,
          harvest_date: undefined,
          expiration_date: undefined,
          lab_tested: undefined,
          created_at: '',
          updated_at: ''
        };
        
        // Convert product database types to interface types
        const typedProduct: Product = {
          id: product.id,
          organization_id: product.organization_id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory ?? undefined,
          description: product.description ?? '',
          image_url: product.image_url ?? '',
          strain_type: product.strain_type as 'sativa' | 'indica' | 'hybrid',
          genetics: product.genetics ?? undefined,
          created_at: product.created_at ?? '',
          updated_at: product.updated_at ?? ''
        };
        
        return {
          ...typedProduct,
          variant: firstVariant
        };
      });

      set({ 
        products: (products || []).map((p: any) => ({
          id: p.id,
          organization_id: p.organization_id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          subcategory: p.subcategory ?? undefined,
          description: p.description ?? '',
          image_url: p.image_url ?? '',
          strain_type: p.strain_type as 'sativa' | 'indica' | 'hybrid',
          genetics: p.genetics ?? undefined,
          created_at: p.created_at ?? '',
          updated_at: p.updated_at ?? ''
        })),
        variants: (variants || []).map((v: any) => ({
          id: v.id,
          product_id: v.product_id,
          size_weight: v.size_weight ?? undefined,
          price: v.price ?? 0,
          original_price: v.original_price ?? undefined,
          thc_percentage: v.thc_percentage ?? 0, // Required field
          cbd_percentage: v.cbd_percentage ?? undefined,
          total_cannabinoids: v.total_cannabinoids ?? undefined,
          terpene_profile: v.terpene_profile ?? {},
          inventory_level: v.inventory_level ?? 0,
          is_available: v.is_available ?? false,
          batch_number: v.batch_number ?? undefined,
          harvest_date: v.harvest_date ?? undefined,
          expiration_date: v.expiration_date ?? undefined,
          lab_tested: v.lab_tested ?? undefined,
          created_at: v.created_at ?? '',
          updated_at: v.updated_at ?? ''
        })),
        productsWithVariants,
        isLoading: false,
        error: null
      });
      
      console.log(`✅ Products store updated with ${productsWithVariants.length} products`);
      
    } catch (err) {
      console.error('❌ Error fetching products:', err);
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
      console.log(`🔍 Searching with vibe: "${vibe}" for organization: ${organizationId || 'unknown'}`);
      
      // Use the enhanced recommendation engine with AI capabilities
      const results = await recommendProducts(
        get().productsWithVariants, 
        vibe, 
        userType, 
        3,
        organizationId // Pass the organization ID to the recommendation engine
      );
      
      console.log(`✅ Search complete - found ${results.products.length} products`);
      
      set({ isLoading: false });
      return results;
    } catch (err) {
      console.error('❌ Search error:', err);
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
        subcategory: undefined,
        description: '',
        image_url: '',
        strain_type: item.strain_type as 'sativa' | 'indica' | 'hybrid',
        genetics: undefined,
        created_at: '',
        updated_at: '',
        variant: {
          id: item.variant_id,
          product_id: item.product_id,
          size_weight: undefined,
          price: item.price ?? 0,
          original_price: undefined,
          thc_percentage: item.thc_percentage ?? 0,
          cbd_percentage: item.cbd_percentage ?? undefined,
          total_cannabinoids: undefined,
          terpene_profile: item.terpene_profile || {},
          inventory_level: item.inventory_level ?? 0,
          is_available: true,
          batch_number: undefined,
          harvest_date: undefined,
          expiration_date: undefined,
          lab_tested: undefined,
          created_at: '',
          updated_at: ''
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
  },

  // Clear products when auth state changes
  clearProducts: () => {
    console.log('🧹 Clearing products store');
    set({
      products: [],
      variants: [],
      productsWithVariants: [],
      isLoading: false,
      error: null
    });
  },

  // New method for getting more recommendations
  getMoreRecommendations: async (vibe: string, offset: number, userType?: 'kiosk' | 'staff') => {
    set({ isLoading: true, error: null });
    
    try {
      const { productsWithVariants } = get();
      
      if (productsWithVariants.length === 0) {
        await get().fetchProducts();
      }

      // Get the organization ID from the auth store
      const { organizationId } = useSimpleAuthStore.getState();
      console.log(`🔍 Getting more recommendations with vibe: "${vibe}" for organization: ${organizationId || 'unknown'}`);
      
             // Use the enhanced recommendation engine with AI capabilities
       const results = await recommendProducts(
         get().productsWithVariants, 
         vibe, 
         userType || 'kiosk',
         3, // maxResults
         organizationId, // organizationId
         offset // offset for pagination
       );
      
      console.log(`✅ More recommendations complete - found ${results.products.length} products`);
      
      set({ isLoading: false });
      return results;
    } catch (err) {
      console.error('❌ More recommendations error:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to get more recommendations' 
      });
      
      // Return empty results in case of error
      return { products: [], effects: [], isAIPowered: false };
    }
  }
}));