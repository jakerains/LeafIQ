import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../stores/productsStore';
import KioskHome from './KioskHome';
import KioskResults from './KioskResults';
import Logo from '../../components/ui/Logo';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const KioskView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchProductsByVibe, isLoading } = useProductsStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [effects, setEffects] = useState<string[]>([]);
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col">
        <header className="flex flex-col items-center mb-12 mt-8">
          <div className="flex items-center mb-4 transform scale-125">
            <Logo size="lg" />
          </div>
          
          <div className="flex items-center space-x-3 absolute top-8 right-8">
            <motion.button
              onClick={handleStaffLogin}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white bg-opacity-70 backdrop-blur-sm rounded-xl text-gray-500 hover:bg-opacity-90 hover:text-gray-700 shadow-sm transition-all duration-200"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Admin Login"
            >
              <User size={16} />
              <span>Admin</span>
            </motion.button>
            
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