import { create } from 'zustand';
import { Product, Variant, ProductWithVariant } from '../types';
import { demoProducts, demoVariants } from '../data/demoData';
import { recommendProducts } from '../utils/recommendationEngine';

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
      // In a real app, this would fetch from an API
      // For the MVP, we'll use demo data
      const products = demoProducts;
      const variants = demoVariants;
      
      const productsWithVariants: ProductWithVariant[] = products.map(product => {
        const productVariants = variants.filter(v => v.product_id === product.id);
        const firstVariant = productVariants[0] || null;
        
        if (!firstVariant) return null;
        
        return {
          ...product,
          variant: firstVariant
        };
      }).filter(Boolean) as ProductWithVariant[];
      
      set({ 
        products, 
        variants, 
        productsWithVariants,
        isLoading: false 
      });
    } catch (err) {
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
      
      // Use the enhanced recommendation engine with AI capabilities
      const results = await recommendProducts(get().productsWithVariants, vibe, userType, 3);
      
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
  }
}));