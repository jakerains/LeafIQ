import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  History, 
  Sparkles, 
  ScanLine,
  Bookmark,
  X,
  ChevronDown,
  Tag,
  Leaf,
  AlertCircle,
  Package,
  ArrowUpDown,
  Zap
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
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const { 
    searchProductsByVibe, 
    isLoading, 
    fetchProducts, 
    productsWithVariants, 
    error 
  } = useProductsStore();
  
  const { 
    searchHistory, 
    addSearchHistory, 
    clearSearchHistory, 
    addNotification 
  } = useStaffModeStore();

  // Debug products availability
  useEffect(() => {
    console.log('🛍️ ProductSearchMode - Products available:', {
      total: productsWithVariants.length,
      isLoading,
      error,
      sampleProduct: productsWithVariants[0] ? {
        name: productsWithVariants[0].name,
        category: productsWithVariants[0].category,
        inventory: productsWithVariants[0].variant?.inventory_level
      } : null
    });
  }, [productsWithVariants, isLoading, error]);

  // Advanced filters state
  const [filters, setFilters] = useState({
    strainType: '',
    priceRange: '',
    inventoryLevel: '',
    category: '',
  });

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

  const filterProducts = (products: ProductWithVariant[]) => {
    let filtered = [...products];
    
    if (filters.strainType && filters.strainType !== '') {
      filtered = filtered.filter(p => 
        p.strain_type?.toLowerCase() === filters.strainType.toLowerCase()
      );
    }
    
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.inventoryLevel && filters.inventoryLevel !== '') {
      filtered = filtered.filter(p => {
        const level = p.variant?.inventory_level || 0;
        if (filters.inventoryLevel === 'high') return level > 10;
        if (filters.inventoryLevel === 'medium') return level >= 5 && level <= 10;
        if (filters.inventoryLevel === 'low') return level > 0 && level < 5;
        if (filters.inventoryLevel === 'out') return level === 0;
        return true;
      });
    }
    
    if (filters.priceRange && filters.priceRange !== '') {
      filtered = filtered.filter(p => {
        const price = p.variant?.price || 0;
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          return price >= min && price <= max;
        } else {
          // Handle "100+" case
          return price >= min;
        }
      });
    }
    
    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'inStock') {
        filtered = filtered.filter(p => (p.variant?.inventory_level || 0) > 0);
      } else if (activeTab === 'lowStock') {
        filtered = filtered.filter(p => {
          const level = p.variant?.inventory_level || 0;
          return level > 0 && level < 5;
        });
      } else if (activeTab === 'outOfStock') {
        filtered = filtered.filter(p => (p.variant?.inventory_level || 0) === 0);
      }
    }
    
    // Sort products
    if (sortOrder === 'priceAsc') {
      filtered.sort((a, b) => (a.variant?.price || 0) - (b.variant?.price || 0));
    } else if (sortOrder === 'priceDesc') {
      filtered.sort((a, b) => (b.variant?.price || 0) - (a.variant?.price || 0));
    } else if (sortOrder === 'nameAsc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'nameDesc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'stockLevel') {
      filtered.sort((a, b) => (b.variant?.inventory_level || 0) - (a.variant?.inventory_level || 0));
    }
    
    return filtered;
  };

  const filteredResults = filterProducts(searchResults);
  
  const getInventoryStatusColor = (level: number) => {
    if (level === 0) return 'text-red-600';
    if (level < 5) return 'text-amber-500';
    return 'text-emerald-600';
  };

  const getSortLabel = (order: string) => {
    switch (order) {
      case 'relevance': return 'Relevance';
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      case 'nameAsc': return 'Name: A to Z';
      case 'nameDesc': return 'Name: Z to A';
      case 'stockLevel': return 'Stock Level';
      default: return 'Relevance';
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200 overflow-hidden">
        {/* Search Header */}
        <div className="bg-background">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Enhanced Product Search</h2>
            
            {isAIPowered && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-xs font-medium">
                <Sparkles size={12} className="text-purple-600" />
                AI-Powered
              </span>
            )}
          </div>
          
          {/* Search Input with Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs h-10"
              >
                <History size={16} className="mr-1.5" />
                History
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs h-10"
              >
                <Filter size={16} className="mr-1.5" />
                Filters
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''} ml-1.5`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-10"
              >
                <ScanLine size={16} className="mr-1.5" />
                Scan
              </Button>
            </div>
          </div>

          {/* Search History Dropdown */}
          <AnimatePresence>
            {showHistory && searchHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-800">Recent Searches</span>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs px-2 py-1 text-gray-500 hover:text-red-600 rounded"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((query, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => handleQuickSearch(query)}
                            className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            {query}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800 flex items-center">
                      <Filter size={14} className="mr-2" />
                      Advanced Filters
                    </h3>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs hover:bg-gray-50"
                      >
                        <ArrowUpDown size={14} />
                        Sort: {getSortLabel(sortOrder)}
                        <ChevronDown size={12} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSortMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-48">
                          {[
                            { value: 'relevance', label: 'Relevance' },
                            { value: 'priceAsc', label: 'Price: Low to High' },
                            { value: 'priceDesc', label: 'Price: High to Low' },
                            { value: 'nameAsc', label: 'Name: A to Z' },
                            { value: 'nameDesc', label: 'Name: Z to A' },
                            { value: 'stockLevel', label: 'Stock Level' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortOrder(option.value);
                                setShowSortMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Strain Type
                      </label>
                      <select 
                        value={filters.strainType}
                        onChange={(e) => setFilters({...filters, strainType: e.target.value})}
                        className="w-full h-9 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Types</option>
                        <option value="indica">Indica</option>
                        <option value="sativa">Sativa</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Price Range
                      </label>
                      <select 
                        value={filters.priceRange}
                        onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                        className="w-full h-9 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Prices</option>
                        <option value="0-25">$0 - $25</option>
                        <option value="25-50">$25 - $50</option>
                        <option value="50-100">$50 - $100</option>
                        <option value="100-200">$100 - $200</option>
                        <option value="200-500">$200+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Stock Level
                      </label>
                      <select 
                        value={filters.inventoryLevel}
                        onChange={(e) => setFilters({...filters, inventoryLevel: e.target.value})}
                        className="w-full h-9 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Stock</option>
                        <option value="high">High Stock (10+)</option>
                        <option value="medium">Medium Stock (5-10)</option>
                        <option value="low">Low Stock (1-5)</option>
                        <option value="out">Out of Stock</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Category
                      </label>
                      <select 
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full h-9 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        <option value="flower">Flower</option>
                        <option value="concentrates">Concentrates</option>
                        <option value="edibles">Edibles</option>
                        <option value="vapes">Vapes</option>
                        <option value="topicals">Topicals</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                  
                  {Object.values(filters).some(v => v !== '') && (
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => setFilters({
                          strainType: '',
                          priceRange: '',
                          inventoryLevel: '',
                          category: '',
                        })}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Results Tabs */}
        {searchResults.length > 0 && (
          <div className="border-t border-gray-200 mt-4">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'all', label: `All Results (${searchResults.length})` },
                { id: 'inStock', label: `In Stock (${searchResults.filter(p => (p.variant?.inventory_level || 0) > 0).length})` },
                { id: 'lowStock', label: `Low Stock (${searchResults.filter(p => {
                  const level = p.variant?.inventory_level || 0;
                  return level > 0 && level < 5;
                }).length})` },
                { id: 'outOfStock', label: `Out of Stock (${searchResults.filter(p => (p.variant?.inventory_level || 0) === 0).length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <SearchResultsContent 
              results={filteredResults} 
              effects={effects}
              searchQuery={searchQuery}
              getInventoryStatusColor={getInventoryStatusColor}
            />
          </div>
        )}
      </div>
      
      {/* Empty State */}
      {searchQuery && !isLoading && filteredResults.length === 0 && (
        <EmptySearchState 
          searchQuery={searchQuery} 
          handleQuickSearch={handleQuickSearch}
        />
      )}
    </div>
  );
};

interface SearchResultsContentProps {
  results: ProductWithVariant[];
  effects: string[];
  searchQuery: string;
  getInventoryStatusColor: (level: number) => string;
}

const SearchResultsContent: React.FC<SearchResultsContentProps> = ({ 
  results, 
  effects,
  searchQuery,
  getInventoryStatusColor
}) => {
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No products match the current filters.
      </div>
    );
  }
  
  return (
    <>
      <div className="px-5 py-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-gray-800">
            {results.length} matching products for "{searchQuery}"
          </h3>
          
          {effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {effects.slice(0, 3).map((effect, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs"
                >
                  <Leaf size={10} />
                  {effect}
                </span>
              ))}
              {effects.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs">
                  +{effects.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Bookmark size={14} className="mr-1.5" />
            Save Search
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {results.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              delay: index * 0.05,
              damping: 15
            }}
          >
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-3 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs">
                    {product.category || 'Uncategorized'}
                  </span>
                  
                  <div className={`flex items-center text-xs font-medium ${getInventoryStatusColor(product.variant?.inventory_level || 0)}`}>
                    <Package size={12} className="mr-1" />
                    {product.variant?.inventory_level || 0} in stock
                  </div>
                </div>
                
                <div className="flex gap-3 flex-grow">
                  {product.image_url && (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {product.strain_type && (
                        <span 
                          className={`inline-block px-2 py-0.5 text-xs rounded border ${
                            product.strain_type.toLowerCase() === 'indica' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            product.strain_type.toLowerCase() === 'sativa' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          {product.strain_type}
                        </span>
                      )}
                      
                      {product.variant?.thc_percentage && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs">
                          <Zap size={10} />
                          {product.variant.thc_percentage.toFixed(1)}% THC
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {product.description || 'No description available'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                  <div className="font-medium text-gray-900">
                    ${product.variant?.price.toFixed(2) || '0.00'}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Tag size={14} className="mr-1.5" />
                      Add to Cart
                    </Button>
                    <Button size="sm" className="h-8 text-xs">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

interface EmptySearchStateProps {
  searchQuery: string;
  handleQuickSearch: (query: string) => void;
}

const EmptySearchState: React.FC<EmptySearchStateProps> = ({ searchQuery, handleQuickSearch }) => {
  return (
    <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertCircle size={28} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">No products found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any products matching "{searchQuery}". Try adjusting your search terms or filters, or try one of these popular searches:
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
        {['relaxing', 'energizing', 'pain relief', 'sleep', 'creative', 'focus', 'high THC', 'CBD', 'hybrid'].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 transition-colors text-xs"
            onClick={() => handleQuickSearch(suggestion)}
          >
            Try "{suggestion}"
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductSearchMode;