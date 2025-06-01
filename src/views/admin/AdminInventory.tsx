import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Plus, Pencil, Trash2, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useProductsStore } from '../../stores/productsStore';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import { Product, Variant, ProductWithVariant } from '../../types';
import ProductForm from './components/ProductForm';
import ImportExportOptions from './components/ImportExportOptions';

const AdminInventory = () => {
  const { products, variants, fetchProducts, isLoading, error } = useProductsStore();
  const { organizationId, dispensaryName } = useSimpleAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithVariant | null>(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showImportExport, setShowImportExport] = useState(false);
  
  // Debug auth state and fetch products on mount
  useEffect(() => {
    console.log('📦 AdminInventory - Auth state:', { 
      organizationId, 
      dispensaryName,
      productsCount: products.length,
      isLoading,
      error 
    });
    
    if (organizationId) {
      fetchProducts();
    } else {
      console.error('❌ AdminInventory - No organizationId found for admin user');
    }
  }, [fetchProducts, organizationId, dispensaryName, products.length, isLoading, error]);
  
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
      // Handle different field types
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'thc') {
        comparison = a.thc_percentage - b.thc_percentage;
      } else if (sortField === 'inventory') {
        comparison = a.variant.inventory_level - b.variant.inventory_level;
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
  
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  
  const handleEditProduct = (product: ProductWithVariant) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, this would send a delete request to the API
      console.log(`Deleting product ${productId}`);
      alert(`Product ${productId} deleted successfully`);
    }
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };
  
  const handleFormSubmit = (formData: any) => {
    // In a real app, this would send the form data to the API
    console.log('Form submitted:', formData);
    alert(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
    setShowForm(false);
    setEditingProduct(null);
  };

  // Show loading state if no organization or while loading
  if (!organizationId || (isLoading && products.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
      
      {showForm ? (
        <ProductForm 
          product={editingProduct} 
          onClose={handleFormClose} 
          onSubmit={handleFormSubmit}
        />
      ) : showImportExport ? (
        <ImportExportOptions onClose={() => setShowImportExport(false)} />
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Package size={20} className="text-primary-600" />
                  <h2 className="text-xl font-semibold">Inventory Management</h2>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowImportExport(true)}
                  >
                    Import/Export
                  </Button>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={handleAddNewProduct}
                  >
                    Add Product
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name or brand"
                    className="pl-10 w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
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
                    className="pl-10 w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
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
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          className="flex items-center space-x-1 focus:outline-none"
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
                          className="flex items-center space-x-1 focus:outline-none"
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
                          className="flex items-center space-x-1 focus:outline-none"
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
                          className="flex items-center space-x-1 focus:outline-none"
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
                          className="flex items-center space-x-1 focus:outline-none"
                          onClick={() => toggleSort('inventory')}
                        >
                          <span>Inventory</span>
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
                      <tr key={product.id} className="hover:bg-gray-50">
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
                            {product.thc_percentage ? product.thc_percentage.toFixed(1) : '0.0'}%
                          </div>
                          {product.cbd_percentage && product.cbd_percentage > 0 && (
                            <div className="text-xs text-gray-500">
                              CBD: {product.cbd_percentage.toFixed(1)}%
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.price ? product.price.toFixed(2) : '0.00'}
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
                            onClick={() => handleEditProduct(product)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
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
                        : "Add your first product to get started"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                  Showing {filteredProducts.length} of {products.length} products
                </div>
                <div>
                  {categoryFilter && (
                    <button 
                      className="flex items-center text-primary-600 hover:text-primary-800"
                      onClick={() => setCategoryFilter('')}
                    >
                      <X size={14} className="mr-1" /> Clear filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminInventory;