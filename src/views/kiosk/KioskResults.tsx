import { motion } from 'framer-motion';
import ProductCard from '../../components/ui/ProductCard';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Search, Sparkles, BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import { ProductWithVariant } from '../../types';
import { useNavigate } from 'react-router-dom';

interface KioskResultsProps {
  searchQuery: string;
  results: ProductWithVariant[];
  onReset: () => void;
  isAIPowered: boolean;
  effects: string[];
}

const KioskResults = ({ searchQuery, results, onReset, isAIPowered, effects }: KioskResultsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  const navigate = useNavigate();

  const handleProductSelect = (product: ProductWithVariant) => {
    setSelectedProduct(product);
    // In a full implementation, this would open a detailed product view
  };

  const handleBackToSearch = () => {
    onReset();
    navigate('/kiosk');
  };

  // Empty state when no results found
  if (results.length === 0) {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No matches found for "{searchQuery}"</h2>
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
            Results for "{searchQuery}"
          </h2>
          {isAIPowered && (
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
                <span>{results.length} match{results.length !== 1 ? 'es' : ''}</span>
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

      {/* Effects tags */}
      {effects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-2 justify-center"
        >
          {effects.map((effect, index) => (
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
        {results.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <ProductCard
              product={product}
              effects={effects.slice(0, 2)}
              showTerpenes={true}
              onProductSelect={handleProductSelect}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KioskResults;