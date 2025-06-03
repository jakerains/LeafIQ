import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, ChevronDown, ChevronUp, X, Eye } from 'lucide-react';
import { useProductsStore } from '../../../stores/productsStore';
import { useSimpleAuthStore } from '../../../stores/simpleAuthStore';
import { ProductWithVariant } from '../../../types';
import ProductDetailsModal from '../../../views/admin/components/ProductDetailsModal';

const StaffInventoryMode = () => {
  const { products, variants, fetchProducts, isLoading, error } = useProductsStore();
  const { organizationId, dispensaryName } = useSimpleAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  
  // Debug auth state and fetch products on mount
  useEffect(() => {
    console.log('📦 StaffInventoryMode - Auth state:', { 
      organizationId, 
      dispensaryName,
      productsCount: products.length
    });
    
    if (organizationId) {
      fetchProducts();
    }
  }, [fetchProducts, organizationId, dispensaryName]);
  
  // Combine products with their variants for display
  const productsWithVariants: ProductWithVariant[] = products.map(product => {
    const productVariants = variants.filter(v => v.product_id === product.id);
    const firstVariant = productVariants[0] || {
      id: '',
      product_id: product.id,
      strain_type: 'hybrid',
      terpene_profile: {},
      inventory_level: 0,
      last_updated: '',
      is_available: false,
    };
    
    return {
      ...product,
      variant: firstVariant
    };
  });
  
  // Filter and sort products
  const filteredProducts = productsWithVariants
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = (a.variant?.price || 0) - (b.variant?.price || 0);
      } else if (sortField === 'thc') {
        comparison = (a.variant?.thc_percentage || 0) - (b.variant?.thc_percentage || 0);
      } else if (sortField === 'inventory') {
        comparison = (a.variant?.inventory_level || 0) - (b.variant?.inventory_level || 0);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Handle sorting toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const handleViewProduct = (product: ProductWithVariant) => {
    setSelectedProduct(product);
  };

  // Show loading state if no organization or while loading
  if (!organizationId || (isLoading && products.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
          <strong>Debug:</strong> Org: {organizationId} | Products: {products.length} | Variants: {variants.length}
          {error && <span className="text-red-600"> | Error: {error}</span>}
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Package size={20} className="text-orange-600" />
              <h2 className="text-xl font-semibold">Inventory Overview</h2>
              <span className="text-sm text-gray-500">
                ({filteredProducts.length} products)
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Staff View • Read-Only Access
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or brand"
                className="pl-10 w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="relative w-full md:w-64">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-orange-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center space-x-1 focus:outline-none hover:text-orange-600"
                      onClick={() => toggleSort('name')}
                    >
                      <span>Product</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center space-x-1 focus:outline-none hover:text-orange-600"
                      onClick={() => toggleSort('category')}
                    >
                      <span>Category</span>
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center space-x-1 focus:outline-none hover:text-orange-600"
                      onClick={() => toggleSort('thc')}
                    >
                      <span>THC%</span>
                      {sortField === 'thc' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center space-x-1 focus:outline-none hover:text-orange-600"
                      onClick={() => toggleSort('price')}
                    >
                      <span>Price</span>
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center space-x-1 focus:outline-none hover:text-orange-600"
                      onClick={() => toggleSort('inventory')}
                    >
                      <span>Stock Level</span>
                      {sortField === 'inventory' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white bg-opacity-80 divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => handleViewProduct(product)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={product.image_url} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.variant?.thc_percentage ? product.variant.thc_percentage.toFixed(1) : '0.0'}%
                      </div>
                      {product.variant?.cbd_percentage && product.variant.cbd_percentage > 0 && (
                        <div className="text-xs text-gray-500">
                          CBD: {product.variant.cbd_percentage.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.variant?.price ? product.variant.price.toFixed(2) : '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        (product.variant?.inventory_level || 0) > 10 
                          ? 'bg-green-100 text-green-800' 
                          : (product.variant?.inventory_level || 0) > 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.variant?.inventory_level || 0} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(product);
                        }}
                        className="text-orange-600 hover:text-orange-900 flex items-center space-x-1"
                        title="View product details"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">
                  {searchTerm || categoryFilter 
                    ? "Try adjusting your search or filter" 
                    : "No products available in inventory"}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex items-center space-x-4">
              {categoryFilter && (
                <button 
                  className="flex items-center text-orange-600 hover:text-orange-800"
                  onClick={() => setCategoryFilter('')}
                >
                  <X size={14} className="mr-1" /> Clear filter
                </button>
              )}
              <div className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Staff Product Details Modal (Read-Only) */}
      {selectedProduct && (
        <StaffProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

// Staff-specific modal wrapper that hides edit functionality
const StaffProductDetailsModal: React.FC<{
  product: ProductWithVariant;
  onClose: () => void;
}> = ({ product, onClose }) => {
  // No-op edit function for staff mode
  const handleEdit = () => {
    // Do nothing - staff can't edit
  };

  return (
    <ProductDetailsModal
      product={product}
      onClose={onClose}
      onEdit={handleEdit}
      showEditButton={false}
    />
  );
};

export default StaffInventoryMode; 