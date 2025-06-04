import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../stores/productsStore';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import KioskHome from './KioskHome';
import KioskResults from './KioskResults';
import Logo from '../../components/ui/Logo';
import { motion } from 'framer-motion';
import { User, ChevronDown, Home, Settings } from 'lucide-react';
import AdminPasskeyModal from '../../components/auth/AdminPasskeyModal';

const KioskView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'vibe' | 'activity' | 'cannabis_questions'>('vibe');
  const { searchProductsByVibe, isLoading, fetchProducts, productsWithVariants } = useProductsStore();
  const { organizationId, selectUserMode } = useSimpleAuthStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showAdminPasskeyModal, setShowAdminPasskeyModal] = useState(false);
  const navigate = useNavigate();
  
  // Ensure products are loaded when component mounts
  useEffect(() => {
    if (organizationId && productsWithVariants.length === 0) {
      console.log('🔄 KioskView - Loading products for organization:', organizationId);
      fetchProducts();
    }
  }, [organizationId, fetchProducts, productsWithVariants.length]);
  
  const handleSearch = async (query: string, mode: 'vibe' | 'activity' | 'cannabis_questions' = 'vibe') => {
    console.log('🔍 KioskView.handleSearch called with query:', query, 'mode:', mode);
    setSearchQuery(query);
    setSearchMode(mode);
    
    // If it's cannabis questions, we don't need to search products
    if (mode === 'cannabis_questions') {
      console.log('🧠 Cannabis Questions mode - no product search needed');
      return;
    }
    
    try {
      console.log('📞 Calling searchProductsByVibe...');
      
      // Ensure products are loaded before searching
      if (productsWithVariants.length === 0) {
        console.log('⚠️ No products loaded yet, fetching products first...');
        await fetchProducts();
      }
      
      // Modify the query based on mode to help the recommendation system
      let enhancedQuery = query;
      if (mode === 'activity') {
        enhancedQuery = `activity: ${query}`;
      }
      
      // Now we're sure organizationId is available from the auth store
      // and passed through the call chain
      const results = await searchProductsByVibe(enhancedQuery, 'kiosk');
      
      console.log('📦 Search results received:', {
        products: results.products.length,
        isAIPowered: results.isAIPowered,
        effects: results.effects,
        firstProduct: results.products[0] ? {
          name: results.products[0].name,
          hasVariant: !!results.products[0].variant,
          price: results.products[0].variant?.price
        } : null
      });
      
      setSearchResults(results.products);
      setIsAIPowered(results.isAIPowered);
      setEffects(results.effects);
      
      console.log(`🎯 Found ${results.products.length} products, navigating to results...`);
      
      if (results.products.length > 0) {
        navigate('/kiosk/results');
        console.log('✅ Navigation to /kiosk/results completed');
      } else {
        // No results handling
        setSearchResults([]);
        navigate('/kiosk/results'); // Still navigate to show the empty state
        console.log('🚫 No results found, navigating to empty state');
      }
    } catch (error) {
      console.error('❌ Search error in KioskView:', error);
      setSearchResults([]);
      navigate('/kiosk/results'); // Navigate to show error state
    }
  };
  
  const handleReset = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsAIPowered(false);
    setEffects([]);
    navigate('/kiosk');
  };

  const handleStaffLogin = () => {
    // Switch to admin mode before navigating
    selectUserMode('employee');
    navigate('/app/staff');
    setShowAdminMenu(false);
  };

  const handleAdminLogin = () => {
    setShowAdminPasskeyModal(true);
    setShowAdminMenu(false);
  };

  const handleAdminLoginSuccess = () => {
    selectUserMode('admin');
    navigate('/app/admin');
  };

  const handleDemoHub = () => {
    navigate('/');
    setShowAdminMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col">
        <header className="flex flex-col items-center mb-8 mt-8">
          <img 
            src="/leafiq-logo.png" 
            alt="LeafIQ" 
            className="h-48 mb-4 drop-shadow-lg filter shadow-primary-500/50"
          />
          
          <div className="flex items-center space-x-3 absolute top-8 right-8">
            <div className="relative">
              <motion.button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white bg-opacity-70 backdrop-blur-sm rounded-xl text-gray-500 hover:bg-opacity-90 hover:text-gray-700 shadow-sm transition-all duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Admin Menu"
              >
                <User size={16} />
                <span>Menu</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showAdminMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              {showAdminMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 w-48 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <button
                    onClick={handleDemoHub}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 hover:bg-opacity-80 transition-colors duration-200 flex items-center gap-3"
                  >
                    <Home size={16} className="text-blue-500" />
                    <div>
                      <div className="font-medium">Demo Hub</div>
                      <div className="text-xs text-gray-500">Return to demo options</div>
                    </div>
                  </button>
                  <button
                    onClick={handleStaffLogin}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 hover:bg-opacity-80 transition-colors duration-200 flex items-center gap-3"
                  >
                    <User size={16} className="text-blue-500" />
                    <div>
                      <div className="font-medium">Staff Mode</div>
                      <div className="text-xs text-gray-500">Access staff dashboard</div>
                    </div>
                  </button>
                  <button
                    onClick={handleAdminLogin}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 hover:bg-opacity-80 transition-colors duration-200 flex items-center gap-3"
                  >
                    <Settings size={16} className="text-purple-500" />
                    <div>
                      <div className="font-medium">Admin Access</div>
                      <div className="text-xs text-gray-500">Requires passkey</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
            
            <motion.button
              onClick={handleReset}
              className="px-4 py-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-opacity-90 shadow-sm transition-all duration-200"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Over
            </motion.button>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col justify-center">
          <Routes>
            <Route 
              path="/" 
              element={
                <KioskHome 
                  onSearch={handleSearch} 
                  isLoading={isLoading} 
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                <KioskResults 
                  searchQuery={searchQuery} 
                  results={searchResults}
                  onReset={handleReset}
                  isAIPowered={isAIPowered}
                  effects={effects}
                />
              } 
            />
          </Routes>
        </div>
      </div>

      {/* Admin Passkey Modal */}
      <AdminPasskeyModal
        isOpen={showAdminPasskeyModal}
        onClose={() => setShowAdminPasskeyModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default KioskView;