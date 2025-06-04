import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Loader, Info, ShoppingBag, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { ProductWithVariant } from '../../types';
import { getCannabisKnowledgeResponse } from '../../lib/supabase'; 
import {
  shouldUseInventoryRAG,
  getInventoryExamplesForQuery,
  formatProductRecommendation
} from '../../utils/budInventoryAccess';

interface CannabisQuestionsChatProps {
  onSearch?: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading?: boolean;
}

const CannabisQuestionsChat: React.FC<CannabisQuestionsChatProps> = ({
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'bot'; 
    text: string;
    products?: ProductWithVariant[];
    introText?: string;
  }>>([
    {
      type: 'bot', 
      text: "I'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!"
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false); // State for typing indicator
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  
  // Auto-scroll to bottom of chat container when messages are added
  useEffect(() => {
    // Only scroll the chat container, not the entire page
    if (chatEndRef.current && chatContainerRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'start' 
      });
    }
  }, [chatHistory, isBotTyping]); // Include isBotTyping to scroll when indicator appears

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || isBotTyping) return; // Prevent multiple submissions
    
    const userQuery = query.trim();
    // Add user message to chat history
    setChatHistory(prev => [...prev, {type: 'user', text: userQuery}]);
    setQuery(''); // Clear input immediately
    setIsBotTyping(true); // Show typing indicator
    
    // Forward the search query if onSearch is provided (for logging/analytics)
    if (onSearch) {
      onSearch(userQuery, 'cannabis_questions');
    }
    
    try {
      // First, check if this is a question that should use inventory information
      const useInventory = shouldUseInventoryRAG(userQuery);
      
      let botResponse: string;
      let productRecommendations: ProductWithVariant[] = [];
      let introText = '';
      
      // Get the standard knowledge response
      botResponse = await getCannabisKnowledgeResponse(userQuery);
      
      // If this is a question that should use inventory, add product examples
      if (useInventory) {
        try {
          const inventoryExamples = await getInventoryExamplesForQuery(userQuery);
          productRecommendations = inventoryExamples.products;
          introText = inventoryExamples.introText;
        } catch (inventoryError) {
          console.error("Error getting inventory examples:", inventoryError);
        }
      }
      
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: botResponse || "I'm sorry, I couldn't find an answer to that question.",
          products: productRecommendations.length > 0 ? productRecommendations : undefined,
          introText: introText || undefined
        }
      ]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: "I'm sorry, I encountered an error while trying to answer. Please try again."
        }
      ]);
    } finally {
      setIsBotTyping(false); // Hide typing indicator
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading || isBotTyping) return; // Prevent if already loading or typing
    
    setQuery(suggestion); // Set query in input field
    
    // Auto submit after a brief delay to allow user to see what was selected
    setTimeout(() => {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }, 300);
  };

  // Format product card for display in the chat
  const ProductCard = ({ product }: { product: ProductWithVariant }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg overflow-hidden shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <div className="flex">
          {product.image_url && (
            <div className="w-20 h-20 flex-shrink-0">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-3 flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
            <p className="text-xs text-gray-600">{product.brand}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                  {product.variant.thc_percentage?.toFixed(1)}% THC
                </span>
                {product.variant.cbd_percentage && product.variant.cbd_percentage > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {product.variant.cbd_percentage.toFixed(1)}% CBD
                  </span>
                )}
              </div>
              <span className="text-emerald-600 font-medium text-sm">
                ${product.variant.price?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Product details modal
  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto p-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Product Details</h3>
            <button 
              onClick={() => setSelectedProduct(null)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            {selectedProduct.image_url ? (
              <img 
                src={selectedProduct.image_url} 
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-gray-400" size={32} />
              </div>
            )}
            
            <div>
              <h4 className="font-bold text-gray-900">{selectedProduct.name}</h4>
              <p className="text-gray-600">{selectedProduct.brand}</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {selectedProduct.strain_type}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                  {selectedProduct.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
              <p className="text-sm text-gray-600">
                {selectedProduct.description || `${selectedProduct.strain_type} ${selectedProduct.category} from ${selectedProduct.brand}.`}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="text-xs font-medium text-gray-700 mb-1">THC Content</h5>
                <p className="text-lg font-bold text-green-600">
                  {selectedProduct.variant.thc_percentage?.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="text-xs font-medium text-gray-700 mb-1">CBD Content</h5>
                <p className="text-lg font-bold text-blue-600">
                  {selectedProduct.variant.cbd_percentage?.toFixed(1) || '0.0'}%
                </p>
              </div>
            </div>
            
            {selectedProduct.variant.terpene_profile && 
             Object.keys(selectedProduct.variant.terpene_profile).length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Terpene Profile</h5>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedProduct.variant.terpene_profile)
                    .filter(([_, value]) => (value as number) > 0)
                    .sort(([_, a], [_, b]) => (b as number) - (a as number))
                    .slice(0, 6)
                    .map(([terpene, value]) => (
                      <div key={terpene} className="flex justify-between items-center">
                        <span className="text-xs capitalize">{terpene}:</span>
                        <span className="text-xs font-medium">{(value as number).toFixed(2)}%</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Price</h5>
                <p className="text-lg font-bold text-green-600">
                  ${selectedProduct.variant.price?.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Stock</h5>
                <p className="text-lg font-bold text-blue-600">
                  {selectedProduct.variant.inventory_level} units
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Info size={16} className="mr-1" />
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-emerald-700">Cannabis Knowledge Center</h2>
        <p className="text-gray-600 mt-2">
          Ask me anything about cannabis - effects, strains, consumption methods, or terminology.
        </p>
      </motion.div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 overflow-hidden max-w-5xl mx-auto">
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="overflow-y-auto p-6 space-y-4 bg-white bg-opacity-70" 
            style={{ maxHeight: '400px', minHeight: '300px' }}
          >
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''} max-w-[85%]`}>
                  {message.type === 'bot' && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src="/budbuddy.png" 
                        alt="Bud" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`${
                    message.type === 'user' 
                      ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm' 
                      : 'bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100'
                  }`}>
                    <p className={`${message.type === 'user' ? 'text-white' : 'text-gray-700'} leading-relaxed`}>
                      {message.text}
                    </p>
                    
                    {/* Product recommendations */}
                    {message.type === 'bot' && message.products && message.products.length > 0 && (
                      <div className="mt-4">
                        {message.introText && (
                          <p className="text-sm text-gray-600 mb-3 italic">{message.introText}</p>
                        )}
                        <div className="space-y-2">
                          {message.products.map((product, productIndex) => (
                            <ProductCard key={productIndex} product={product} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0 h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Bot typing indicator */}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src="/budbuddy.png" 
                      alt="Bud" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* This div is used for scrolling to bottom */}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white bg-opacity-90 border-t border-green-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ask about cannabis effects, strains, or consumption methods..."
                disabled={isLoading || isBotTyping}
              />
              <Button 
                type="submit"
                disabled={!query.trim() || isLoading || isBotTyping}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center"
              >
                {isLoading || isBotTyping ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 max-w-3xl"
      >
        {[
          "What are terpenes?",
          "Indica vs. Sativa",
          "How to dose edibles",
          "CBD benefits",
          "What is the entourage effect?",
          "Cannabis for beginners",
          "Microdosing tips"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading || isBotTyping}
            className={`bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-800 border border-emerald-200 
              hover:bg-emerald-50 transition-colors ${(isLoading || isBotTyping) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {suggestion}
          </button>
        ))}
      </motion.div>

      {/* Product Details Modal */}
      {selectedProduct && <ProductDetailsModal />}
    </div>
  );
};

export default CannabisQuestionsChat;