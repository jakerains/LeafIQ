import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useProductsStore } from '../../stores/productsStore';
import SearchInput from '../../components/ui/SearchInput';
import ProductCard from '../../components/ui/ProductCard';
import Logo from '../../components/ui/Logo';
import { Button } from '../../components/ui/button';
import { LogOut, Search, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductWithVariant } from '../../types';

const StaffView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductWithVariant[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
  const { logout } = useAuthStore();
  const { searchProductsByVibe, isLoading, fetchProducts } = useProductsStore();
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const results = await searchProductsByVibe(query, 'staff');
      setSearchResults(results.products);
      setIsAIPowered(results.isAIPowered);
      setEffects(results.effects);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setIsAIPowered(false);
      setEffects([]);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                leftIcon={<LayoutDashboard size={18} />}
                onClick={() => navigate('/staff')}
              >
                Dashboard
              </Button>
              
              <Button 
                variant="ghost"
                leftIcon={<LogOut size={18} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">
            Search for products and view detailed information to assist customers.
          </p>
        </div>
        
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Search size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">Product Search</h2>
          </div>
          <SearchInput 
            onSearch={handleSearch}
            placeholder="Search by desired effect, strain, or product name"
            suggestions={['relaxed', 'energized', 'creative', 'sleepy', 'pain relief', 'focused']}
            isLoading={isLoading}
          />
        </div>
        
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-display font-semibold">
                {searchResults.length} matching products for "{searchQuery}"
              </h2>
              
              {isAIPowered && (
                <motion.div 
                  className="ml-4 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles size={14} className="text-primary-600" />
                  AI-Powered
                </motion.div>
              )}
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
        
        {searchResults.length === 0 && searchQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try another search term or check if we need to update our inventory.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StaffView;