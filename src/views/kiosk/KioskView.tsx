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
  const { searchProductsByVibe, getMoreRecommendations, isLoading, fetchProducts, productsWithVariants } = useProductsStore();
  const { organizationId, selectUserMode } = useSimpleAuthStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
  const [personalizedMessage, setPersonalizedMessage] = useState<string | undefined>();
  const [contextFactors, setContextFactors] = useState<string[] | undefined>();
  const [totalAvailable, setTotalAvailable] = useState<number>(0);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showAdminPasskeyModal, setShowAdminPasskeyModal] = useState(false);
  const navigate = useNavigate();
  
  // Debug effect to track searchQuery changes
  useEffect(() => {
    console.log('🔍 KioskView - searchQuery state changed:', searchQuery);
  }, [searchQuery]);
  
  // Debug when we're on the results route
  useEffect(() => {
    if (window.location.pathname.includes('/results')) {
      console.log('📍 KioskView - Rendering results route with searchQuery:', searchQuery);
      console.log('📍 Results data:', {
        searchQuery,
        searchQueryLength: searchQuery?.length,
        searchResults: searchResults.length,
        isAIPowered,
        personalizedMessage: personalizedMessage?.slice(0, 50) + '...'
      });
    }
  }, [searchQuery, searchResults, isAIPowered, personalizedMessage]);
  
  // Ensure products are loaded when component mounts
  useEffect(() => {
    if (organizationId && productsWithVariants.length === 0) {
      console.log('🔄 KioskView - Loading products for organization:', organizationId);
      fetchProducts();
    }
  }, [organizationId, fetchProducts, productsWithVariants.length]);
  
  const handleSearch = async (query: string, mode: 'vibe' | 'activity' | 'cannabis_questions' = 'vibe') => {
    console.log('🔍 KioskView.handleSearch called with query:', query, 'mode:', mode);
    console.log('🔍 Setting searchQuery state to:', query);
    
    // Set the search query immediately and synchronously
    setSearchQuery(query);
    setSearchMode(mode);
    
    // For cannabis questions, let the Edge Function determine if products should be shown
    if (mode === 'cannabis_questions') {
      console.log('🧠 Cannabis Questions mode - Edge Function will determine product recommendations');
      // The CannabisQuestionsChat component will handle this via supabase.ts
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
        originalQuery: query,
        enhancedQuery: enhancedQuery,
        firstProduct: results.products[0] ? {
          name: results.products[0].name,
          hasVariant: !!results.products[0].variant,
          price: results.products[0].variant?.price
        } : null
      });
      
      // Set all state synchronously before navigation
      setSearchResults(results.products);
      setIsAIPowered(results.isAIPowered);
      setEffects(results.effects);
      setPersonalizedMessage(results.personalizedMessage);
      setContextFactors(results.contextFactors);
      setTotalAvailable(results.totalAvailable || 0);
      setCurrentOffset(3); // Set offset to 3 for next batch
      
      console.log(`🎯 Found ${results.products.length} products, navigating to results...`);
      console.log(`🎯 Current searchQuery state before navigation: "${query}"`);
      console.log(`🎯 AI Message: "${results.personalizedMessage}"`);
      console.log(`🎯 Total available: ${results.totalAvailable}`);
      
      // Navigate regardless of results to show either products or empty state
      navigate('/kiosk/results', { 
        state: { 
          searchQuery: query,
          searchResults: results.products,
          isAIPowered: results.isAIPowered,
          effects: results.effects,
          personalizedMessage: results.personalizedMessage,
          contextFactors: results.contextFactors,
          totalAvailable: results.totalAvailable || 0,
          currentOffset: 3
        } 
      });
      
      if (results.products.length > 0) {
        console.log('✅ Navigation to /kiosk/results completed with products');
      } else {
        console.log('🚫 Navigation to /kiosk/results completed with no products');
      }
    } catch (error) {
      console.error('❌ Search error in KioskView:', error);
      setSearchResults([]);
      navigate('/kiosk/results', { 
        state: { 
          searchQuery: query,
          searchResults: [],
          isAIPowered: false,
          effects: [],
          personalizedMessage: undefined,
          contextFactors: undefined,
          totalAvailable: 0,
          currentOffset: 0
        } 
      }); // Navigate to show error state
    }
  };
  
  const handleLoadMore = async () => {
    if (!searchQuery || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      console.log(`🔍 Loading more recommendations (offset: ${currentOffset})`);
      
      // Modify the query based on mode to help the recommendation system
      let enhancedQuery = searchQuery;
      if (searchMode === 'activity') {
        enhancedQuery = `activity: ${searchQuery}`;
      }
      
      const results = await getMoreRecommendations(enhancedQuery, currentOffset, 'kiosk');
      
      console.log(`📦 More results received:`, {
        products: results.products.length,
        isAIPowered: results.isAIPowered,
        totalAvailable: results.totalAvailable
      });
      
      // Append new products to existing results
      setSearchResults(prev => [...prev, ...results.products]);
      setCurrentOffset(prev => prev + 3);
      
    } catch (error) {
      console.error('❌ Load more error in KioskView:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const handleReset = () => {
    console.log('🔄 Resetting search state and navigating to kiosk home');
    setSearchQuery('');
    setSearchResults([]);
    setIsAIPowered(false);
    setEffects([]);
    setPersonalizedMessage(undefined);
    setContextFactors(undefined);
    setTotalAvailable(0);
    setCurrentOffset(0);
    setIsLoadingMore(false);
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
    navigate('/app');
    setShowAdminMenu(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed top navigation */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center space-x-3">
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
      </div>

      {/* Main centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Content Routes */}
        <div className="w-full max-w-6xl flex flex-col justify-center">
          {/* Logo positioned above interface */}
          <div className="mb-8 text-center">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-20 mx-auto drop-shadow-lg filter shadow-primary-500/50"
            />
          </div>
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
                  personalizedMessage={personalizedMessage}
                  contextFactors={contextFactors}
                  totalAvailable={totalAvailable}
                  currentOffset={currentOffset}
                  onLoadMore={handleLoadMore}
                  isLoadingMore={isLoadingMore}
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