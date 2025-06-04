import { motion } from 'framer-motion';
import ProductCard from '../../components/ui/ProductCard';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Search, Sparkles, BrainCircuit, Plus, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductWithVariant } from '../../types';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerProductModal from '../../components/kiosk/CustomerProductModal';

interface KioskResultsProps {
  searchQuery: string;
  results: ProductWithVariant[];
  onReset: () => void;
  isAIPowered: boolean;
  effects: string[];
  personalizedMessage?: string;
  contextFactors?: string[];
  totalAvailable?: number;
  currentOffset?: number;
  onLoadMore?: () => Promise<void>;
  isLoadingMore?: boolean;
}

const KioskResults = ({ 
  searchQuery, 
  results, 
  onReset, 
  isAIPowered, 
  effects, 
  personalizedMessage, 
  contextFactors,
  totalAvailable = 0,
  currentOffset = 0,
  onLoadMore,
  isLoadingMore = false
}: KioskResultsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Use location state as fallback if props are empty/default
  const effectiveSearchQuery = searchQuery || location.state?.searchQuery || '';
  const effectiveResults = results.length > 0 ? results : (location.state?.searchResults || []);
  const effectiveIsAIPowered = isAIPowered || (location.state?.isAIPowered || false);
  const effectiveEffects = effects.length > 0 ? effects : (location.state?.effects || []);
  const effectivePersonalizedMessage = personalizedMessage || location.state?.personalizedMessage;
  const effectiveContextFactors = contextFactors || location.state?.contextFactors;
  const effectiveTotalAvailable = totalAvailable || location.state?.totalAvailable || 0;
  const effectiveCurrentOffset = currentOffset || location.state?.currentOffset || 0;

  // Debug effect to see what searchQuery we receive
  useEffect(() => {
    console.log('🎯 KioskResults - Received props:', {
      searchQuery: searchQuery,
      searchQueryLength: searchQuery?.length,
      searchQueryType: typeof searchQuery,
      locationSearchQuery: location.state?.searchQuery,
      effectiveSearchQuery: effectiveSearchQuery,
      effectiveSearchQueryLength: effectiveSearchQuery?.length,
      resultsCount: results.length,
      effectiveResultsCount: effectiveResults.length,
      isAIPowered,
      effectiveIsAIPowered,
      effects
    });
  }, [searchQuery, location.state, effectiveSearchQuery, effectiveResults, results, isAIPowered, effectiveIsAIPowered, effects]);

  const handleProductSelect = (product: ProductWithVariant) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleBackToSearch = () => {
    onReset();
    navigate('/kiosk');
  };

  // Empty state when no results found
  if (effectiveResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-3xl mx-auto text-center"
      >
        <div className="p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-full mb-6">
          <Search size={40} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No matches found for "{effectiveSearchQuery}"</h2>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find any products that match your search. Try different terms or browse our recommendations.
        </p>
        <Button
          onClick={handleBackToSearch}
          leftIcon={<ArrowLeft size={16} />}
          className="px-6 py-3 text-lg shadow-lg"
        >
          Try a new search
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header with search info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div className="mb-4 md:mb-0 flex flex-col md:flex-row md:items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0 md:mr-4">
            Results for "{effectiveSearchQuery}"
          </h2>
          {effectiveIsAIPowered && (
            <div className="flex items-center space-x-2">
              <motion.div
                className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Sparkles size={14} className="mr-1 text-purple-500" />
                <span>AI Powered</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-purple-700 text-sm"
              >
                <BrainCircuit size={14} className="inline mr-1" />
                <span>{effectiveResults.length} match{effectiveResults.length !== 1 ? 'es' : ''}</span>
              </motion.div>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={handleBackToSearch}
          leftIcon={<ArrowLeft size={16} />}
          className="bg-white"
        >
          New Search
        </Button>
      </motion.div>

      {/* AI Personalized Message */}
      {effectiveIsAIPowered && effectivePersonalizedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-start space-x-4">
            {/* Bud Buddy Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <img 
                  src="/budbuddy.png" 
                  alt="Bud Buddy" 
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles size={12} className="text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Message Content */}
            <div className="flex-1">
              <motion.h3 
                className="text-lg font-semibold text-purple-900 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Bud Buddy Says:
              </motion.h3>
              <motion.p 
                className="text-gray-700 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {effectivePersonalizedMessage}
              </motion.p>

              {/* Context Factors Tags */}
              {effectiveContextFactors && effectiveContextFactors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {effectiveContextFactors.map((factor, index) => (
                    <motion.span
                      key={factor}
                      className="px-3 py-1 bg-white bg-opacity-70 text-purple-700 rounded-full text-xs font-medium"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                    >
                      {factor}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Effects tags */}
      {effectiveEffects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-2 justify-center"
        >
          {effectiveEffects.map((effect, index) => (
            <motion.div
              key={effect}
              className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium text-sm shadow-sm border border-primary-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              {effect}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {effectiveResults.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <ProductCard
              product={product}
              effects={effectiveEffects.slice(0, 2)}
              showTerpenes={true}
              onProductSelect={handleProductSelect}
            />
          </motion.div>
        ))}
      </div>

      {/* Suggest More Button */}
      {onLoadMore && effectiveTotalAvailable > effectiveCurrentOffset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center mt-8 space-y-4"
        >
          <div className="text-center">
                          <p className="text-gray-600 mb-4">
                Showing {effectiveResults.length} of {effectiveTotalAvailable} recommendations
              </p>
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
              leftIcon={isLoadingMore ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
            >
              {isLoadingMore ? 'Finding more...' : 'Suggest More'}
            </Button>
          </div>
          
          {effectiveIsAIPowered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-2 text-sm text-gray-500"
            >
              <BrainCircuit size={14} />
              <span>AI will find more products that match your preferences</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <CustomerProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          effects={effectiveEffects}
        />
      )}
    </div>
  );
};

export default KioskResults;