import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Loader, Info, ShoppingBag, Database, Zap, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { FlowButton } from '../ui/flow-button';
import { ProductWithVariant } from '../../types';
import { getCannabisKnowledgeResponse } from '../../lib/supabase';
import { ResponseStream } from '../ui/response-stream'; 
import {
  getInventoryExamplesForQuery,
  getConversationContextualProducts
} from '../../utils/budInventoryAccess';

interface CannabisQuestionsChatProps {
  onSearch?: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading?: boolean;
}

// Enhanced chat message interface to include context explanations
interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  products?: ProductWithVariant[];
  introText?: string;
  contextExplanation?: string; // New field for context-aware explanations
  knowledgeInfo?: { contextUsed: boolean; fallback: boolean };
  isStreaming?: boolean;
  streamGenerator?: AsyncIterable<string>;
}

const CannabisQuestionsChat: React.FC<CannabisQuestionsChatProps> = ({
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'bot', 
      text: "I'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!"
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  
  // Auto-scroll to bottom of chat container when messages are added
  useEffect(() => {
    if (chatEndRef.current && chatContainerRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'start' 
      });
    }
  }, [chatHistory, isBotTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || isBotTyping) return;
    
    const userQuery = query.trim();
    // Add user message to chat history
    const updatedHistory = [...chatHistory, {type: 'user' as const, text: userQuery}];
    setChatHistory(updatedHistory);
    setQuery(''); // Clear input immediately
    setIsBotTyping(true);
    
    // Forward the search query if onSearch is provided (for logging/analytics)
    if (onSearch) {
      onSearch(userQuery, 'cannabis_questions');
    }
    
    try {
      // Get the response from the Edge Function with conversation context
      try {
        // Prepare conversation context for better responses - include current conversation
        const conversationContext = updatedHistory.slice(-6).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        
        const response = await getCannabisKnowledgeResponse(userQuery, conversationContext);
        
        // Create bot message with the response
        const botMessage: ChatMessage = {
          type: 'bot' as const,
          text: response.answer,
          knowledgeInfo: {
            contextUsed: response.contextUsed || false,
            fallback: response.fallback || false
          }
        };
        
        // Enhanced: Use conversation-context-aware product suggestions
        if (response.shouldRecommendProducts) {
          try {
            console.log('🧠 Using conversation-context-aware product suggestions');
            
            // Get conversation history for context analysis
            const currentHistory = updatedHistory.map(msg => ({
              type: msg.type,
              text: msg.text,
              products: msg.products
            }));
            
            // Use enhanced contextual product suggestions
            const contextualResult = await getConversationContextualProducts(userQuery, currentHistory);
            
            if (contextualResult.products.length > 0) {
              botMessage.products = contextualResult.products;
              botMessage.introText = contextualResult.introText;
              botMessage.contextExplanation = contextualResult.contextExplanation;
            } else {
              // Fallback to regular inventory examples if contextual fails
              console.log('🔄 Falling back to regular inventory examples');
              const inventoryExamples = await getInventoryExamplesForQuery(userQuery);
              botMessage.products = inventoryExamples.products;
              botMessage.introText = inventoryExamples.introText;
            }
          } catch (inventoryError) {
            console.error("Error getting contextual product suggestions:", inventoryError);
          }
        }
        
        setChatHistory(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error("Error getting cannabis knowledge response:", error);
        setChatHistory(prev => [
          ...prev, 
          {
            type: 'bot',
            text: "I'm sorry, I encountered an error while trying to answer. Please try again.",
            knowledgeInfo: { contextUsed: false, fallback: true }
          }
        ]);
      }
      
    } catch (error) {
      console.error("Error setting up streaming:", error);
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: "I'm sorry, I encountered an error while trying to answer. Please try again.",
          knowledgeInfo: { contextUsed: false, fallback: true }
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Modified to just add the suggestion to the query instead of triggering search
  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading || isBotTyping) return; // Prevent if already loading or typing
    
    // Check if the query is empty or already ends with a comma
    if (query.trim() === '' || query.trim().endsWith(',')) {
      // If empty or ends with comma, just add the suggestion
      setQuery((prev) => prev.trim() + (prev.trim() ? ' ' : '') + suggestion);
    } else {
      // Otherwise add a comma and the suggestion
      setQuery((prev) => prev.trim() + ', ' + suggestion);
    }
  };

  // Format text with proper paragraph breaks and styling
  const formatBotResponse = (text: string): JSX.Element[] => {
    // Split text into sentences and paragraphs
    const sentences = text.split('. ').filter(s => s.trim());
    
    // Group sentences into paragraphs (roughly every 2-3 sentences)
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence;
      
      // Add period back if it's not the last sentence
      if (index < sentences.length - 1) {
        currentParagraph += '. ';
      }
      
      // Create a new paragraph every 2-3 sentences or if we detect natural breaks
      const isNaturalBreak = sentence.includes('For example') || 
                           sentence.includes('Think of it') || 
                           sentence.includes('Trust me') ||
                           sentence.includes('Here\'s the thing') ||
                           sentence.includes('That\'s awesome') ||
                           sentence.includes('If you\'d like');
      
      if ((index + 1) % 3 === 0 || isNaturalBreak || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    });
    
    // Apply styling to paragraphs
    return paragraphs.filter(p => p.length > 0).map((paragraph, index) => {
      // Highlight key phrases for better readability
      const styledParagraph = paragraph
        .replace(/(Hey there!|Trust me on this one!|Here's the thing though|That's awesome!)/g, '<span class="font-medium text-emerald-700">$1</span>')
        .replace(/(For example|Think of it like)/g, '<span class="font-medium text-gray-800">$1</span>')
        .replace(/("start low and go slow")/g, '<span class="font-medium text-amber-700 bg-amber-50 px-1 rounded">$1</span>');
      
      return (
        <p 
          key={index} 
          className="text-gray-700 leading-relaxed text-left"
          dangerouslySetInnerHTML={{ __html: styledParagraph }}
        />
      );
    });
  };

  // Enhanced product card that's always clickable
  const ProductCard = ({ product }: { product: ProductWithVariant }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg overflow-hidden shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={() => setSelectedProduct(product)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
          
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                
                <div className="flex items-center space-x-1 mb-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {product.strain_type}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {product.variant.thc_percentage?.toFixed(1)}% THC
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-600">
                    ${product.variant.price?.toFixed(2)}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Info size={12} className="mr-1 group-hover:text-emerald-500 transition-colors" />
                    Click for details
                  </div>
                </div>
              </div>
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
                    .filter(([, value]) => (value as number) > 0)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
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
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-6">
      {/* Chat header with glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl"
      >
        <div className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg shadow-emerald-500/10 p-6 text-center">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-green-100/30 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-emerald-800 drop-shadow-sm">Cannabis Knowledge Center</h2>
            <p className="text-emerald-700/80 mt-1 font-medium">
              Ask me anything about cannabis - effects, strains, consumption methods, or terminology.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400/30 rounded-full"></div>
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-400/40 rounded-full"></div>
        </div>
      </motion.div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="relative backdrop-blur-sm bg-gradient-to-br from-white/60 to-emerald-50/40 rounded-3xl shadow-2xl border border-white/40 overflow-hidden max-w-5xl mx-auto">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-green-50/30 rounded-3xl"></div>
          
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="relative z-10 overflow-y-auto p-5 space-y-4" 
            style={{ maxHeight: '450px', minHeight: '350px' }}
          >
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row' : ''}`}>
                  {message.type === 'bot' && (
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="/budbuddy.png" 
                          alt="Bud" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {/* Knowledge Source Badge */}
                      {message.knowledgeInfo && message.knowledgeInfo.contextUsed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200"
                          title="Response powered by Pinecone knowledge base"
                        >
                          <Database className="h-3 w-3" />
                          <span>KB</span>
                        </motion.div>
                      )}
                      {message.knowledgeInfo && message.knowledgeInfo.fallback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium border border-orange-200"
                          title="Using fallback response - knowledge base unavailable"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Local</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {message.type === 'user' && (
                    <>
                      <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm">
                        <p className="text-white leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                    </>
                  )}
                  {message.type === 'bot' && (
                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100">
                      {message.isStreaming && message.streamGenerator ? (
                        <div className="text-gray-700 leading-relaxed">
                          <ResponseStream
                            textStream={message.streamGenerator}
                            mode="typewriter"
                            speed={60}
                            className="leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-700 leading-relaxed space-y-3 text-left">
                          {formatBotResponse(message.text)}
                        </div>
                      )}
                      
                      {/* Enhanced Product recommendations with context */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-4">
                          {message.introText && (
                            <p className="text-sm text-gray-600 mb-3 italic">{message.introText}</p>
                          )}
                          
                          {/* Context explanation badge */}
                          {message.contextExplanation && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center space-x-2 mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg"
                            >
                              <Target size={14} className="text-emerald-600 flex-shrink-0" />
                              <span className="text-xs text-emerald-700 font-medium">
                                {message.contextExplanation}
                              </span>
                            </motion.div>
                          )}
                          
                          <div className="space-y-2">
                            {message.products.map((product, productIndex) => (
                              <ProductCard key={productIndex} product={product} />
                            ))}
                          </div>
                        </div>
                      )}
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
          <form onSubmit={handleSubmit} className="relative z-10 p-4 backdrop-blur-md bg-white/80 border-t border-white/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow px-4 py-3 border border-emerald-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                placeholder="Ask about cannabis effects, strains, or consumption methods..."
                disabled={isLoading || isBotTyping}
              />
              <FlowButton
                type="submit"
                text="Ask"
                isLoading={isLoading || isBotTyping}
                disabled={!query.trim() || isLoading || isBotTyping}
                className="shadow-lg"
              />
            </div>
          </form>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 max-w-4xl"
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
            className={`backdrop-blur-sm bg-white/60 border border-white/50 px-3 py-2 rounded-full text-sm font-medium text-emerald-800 
              hover:bg-emerald-50/70 hover:border-emerald-200/60 transition-all duration-200 shadow-sm hover:shadow-md ${(isLoading || isBotTyping) ? 'opacity-50 cursor-not-allowed' : ''}`}
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