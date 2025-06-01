import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  History, 
  Sparkles, 
  ScanLine,
  Bookmark,
  X,
  ChevronDown 
} from 'lucide-react';
import SearchInput from '../../ui/SearchInput';
import ProductCard from '../../ui/ProductCard';
import { Button } from '../../ui/button';
import { useProductsStore } from '../../../stores/productsStore';
import { useStaffModeStore } from '../../../stores/staffModeStore';
import { ProductWithVariant } from '../../../types';

export const ProductSearchMode: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductWithVariant[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { searchProductsByVibe, isLoading, fetchProducts } = useProductsStore();
  const { searchHistory, addSearchHistory, clearSearchHistory, addNotification } = useStaffModeStore();

  // Advanced filters state
  const [filters, setFilters] = useState({
    strainType: '',
    priceRange: '',
    inventoryLevel: '',
    category: '',
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      addSearchHistory(query);
      const results = await searchProductsByVibe(query, 'staff');
      setSearchResults(results.products);
      setIsAIPowered(results.isAIPowered);
      setEffects(results.effects);
      
      addNotification({
        type: 'success',
        message: `Found ${results.products.length} products for "${query}"`
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setIsAIPowered(false);
      setEffects([]);
      
      addNotification({
        type: 'error',
        message: 'Search failed. Please try again.'
      });
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
    setShowHistory(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsAIPowered(false);
    setEffects([]);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Search size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Enhanced Product Search</h2>
        </div>
        
        {/* Search Input with Controls */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
                         <SearchInput 
               onSearch={handleSearch}
               placeholder="Search by effect, strain, product name, or describe what the customer wants..."
               suggestions={[
                 'relaxed', 'energized', 'creative', 'sleepy', 'pain relief', 'focused',
                 'sativa', 'indica', 'hybrid', 'high THC', 'CBD dominant'
               ]}
               isLoading={isLoading}
             />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-1"
          >
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <ScanLine size={16} />
            <span className="hidden sm:inline">Scan</span>
          </Button>
        </div>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-gray-50 rounded-xl p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Recent Searches</span>
              <button
                onClick={clearSearchHistory}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickSearch(query)}
                  className="px-3 py-1 bg-white rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {query}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-gray-50 rounded-xl p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strain Type</label>
                <select 
                  value={filters.strainType}
                  onChange={(e) => setFilters({...filters, strainType: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Types</option>
                  <option value="indica">Indica</option>
                  <option value="sativa">Sativa</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Prices</option>
                  <option value="0-25">$0 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                <select 
                  value={filters.inventoryLevel}
                  onChange={(e) => setFilters({...filters, inventoryLevel: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Stock</option>
                  <option value="high">High Stock (10+)</option>
                  <option value="medium">Medium Stock (5-10)</option>
                  <option value="low">Low Stock (1-5)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="flower">Flower</option>
                  <option value="concentrates">Concentrates</option>
                  <option value="edibles">Edibles</option>
                  <option value="vapes">Vapes</option>
                  <option value="topicals">Topicals</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-display font-semibold">
                {searchResults.length} matching products for "{searchQuery}"
              </h2>
              
              {isAIPowered && (
                <motion.div 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} className="text-purple-600" />
                  AI-Powered
                </motion.div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Bookmark size={16} className="mr-1" />
                Save Search
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
                             <ProductCard 
                 key={product.id}
                 product={product} 
                 effects={effects}
                 showTerpenes={true}
                 showInventory={true}
               />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Empty State */}
      {searchResults.length === 0 && searchQuery && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center"
        >
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold mb-4">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters. Consider searching for effects, strain types, or general product categories.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['relaxing', 'energizing', 'pain relief', 'creative', 'sleep'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(suggestion)}
              >
                Try "{suggestion}"
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}; 