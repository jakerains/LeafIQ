import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../stores/productsStore';
import KioskHome from './KioskHome';
import KioskResults from './KioskResults';
import Logo from '../../components/ui/Logo';
import { motion } from 'framer-motion';
import { User, ChevronDown, Home, Settings } from 'lucide-react';

const KioskView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchProductsByVibe, isLoading } = useProductsStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    try {
      const results = await searchProductsByVibe(query, 'kiosk');
      setSearchResults(results.products);
      setIsAIPowered(results.isAIPowered);
      setEffects(results.effects);
      
      if (results.products.length > 0) {
        navigate('/kiosk/results');
      } else {
        // No results handling
        setSearchResults([]);
        navigate('/kiosk/results'); // Still navigate to show the empty state
      }
    } catch (error) {
      console.error('Search error:', error);
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
    navigate('/admin');
    setShowAdminMenu(false);
  };

  const handleDemoHub = () => {
    navigate('/demo');
    setShowAdminMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col">
        <header className="flex flex-col items-center mb-12 mt-8">
          <div className="flex items-center mb-4 transform scale-125">
            <Logo size="lg" />
          </div>
          
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
                    <Settings size={16} className="text-green-500" />
                    <div>
                      <div className="font-medium">Admin Login</div>
                      <div className="text-xs text-gray-500">Access management tools</div>
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
                <KioskHome onSearch={handleSearch} isLoading={isLoading} />
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
    </div>
  );
}

export default KioskView;