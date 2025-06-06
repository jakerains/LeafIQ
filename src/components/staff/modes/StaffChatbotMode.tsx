import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  Loader, 
  Info, 
  ShoppingBag, 
  Database, 
  Zap, 
  Target, 
  MessageCircle,
  Package,
  X
} from 'lucide-react';
import { Button } from '../../ui/button';
import { ProductWithVariant } from '../../../types';
import { getCannabisKnowledgeResponse } from '../../../lib/supabase';
import { ResponseStream } from '../../ui/response-stream';
import { useProductsStore } from '../../../stores/productsStore';
import {
  getInventoryExamplesForQuery,
  getConversationContextualProducts
} from '../../../utils/budInventoryAccess';

interface StaffChatbotModeProps {
  onSearch?: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading?: boolean;
}

interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  products?: ProductWithVariant[];
  introText?: string;
  contextExplanation?: string;
  knowledgeInfo?: { contextUsed: boolean; fallback: boolean };
  isStreaming?: boolean;
  streamGenerator?: AsyncIterable<string>;
  timestamp: Date;
  id: string;
}

const StaffChatbotMode: React.FC<StaffChatbotModeProps> = ({
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      text: "Hello! I'm your personal budtender assistant with access to your live inventory and cannabis knowledge base. I can help you with product recommendations, cannabis education, inventory checks, and customer consultation support. What would you like assistance with today?",
      timestamp: new Date()
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  const [conversationContext, setConversationContext] = useState<Array<{role: string; content: string}>>([]);
  
  const { 
    productsWithVariants 
  } = useProductsStore();

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

  // Update conversation context when chat history changes
  useEffect(() => {
    const context = chatHistory.slice(-10).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    setConversationContext(context);
  }, [chatHistory]);

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || isBotTyping) return;
    
    const userQuery = query.trim();
    const messageId = generateMessageId();
    
    // Add user message to chat history immediately
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      text: userQuery,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setQuery(''); // Clear input immediately
    setIsBotTyping(true);
    
    // Forward the search query if onSearch is provided (for logging/analytics)
    if (onSearch) {
      onSearch(userQuery, 'cannabis_questions');
    }
    
    try {
      // Get current conversation context including the new user message
      const updatedContext = [...conversationContext, { role: 'user', content: userQuery }];
      
      // Get the response from the Edge Function with conversation context
      const response = await getCannabisKnowledgeResponse(userQuery, updatedContext);
      
      // Create bot message with the response
      const botMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'bot',
        text: response.answer,
        knowledgeInfo: {
          contextUsed: response.contextUsed || false,
          fallback: response.fallback || false
        },
        timestamp: new Date()
      };
      
      // Enhanced: Use conversation-context-aware product suggestions
      if (response.shouldRecommendProducts) {
        try {
          console.log('🧠 Staff chatbot using conversation-context-aware product suggestions');
          
          // Get conversation history for context analysis
          const currentHistory = [...chatHistory, userMessage].map(msg => ({
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
          id: generateMessageId(),
          type: 'bot',
          text: "I'm sorry, I encountered an error while trying to answer. Please try again.",
          knowledgeInfo: { contextUsed: false, fallback: true },
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading || isBotTyping) return;
    
    setQuery(question);
    // Auto-submit after a brief delay to show the question was set
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
  };

  const clearConversation = () => {
    setChatHistory([
      {
        id: 'welcome',
        type: 'bot',
        text: "Conversation cleared! How can I help you with your cannabis expertise today?",
        timestamp: new Date()
      }
    ]);
    setConversationContext([]);
  };

  // Format text with proper paragraph breaks and styling
  const formatBotResponse = (text: string): JSX.Element[] => {
    const sentences = text.split('. ').filter(s => s.trim());
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence;
      
      if (index < sentences.length - 1) {
        currentParagraph += '. ';
      }
      
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
    
    return paragraphs.filter(p => p.length > 0).map((paragraph, index) => {
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
        className="bg-white rounded-lg overflow-hidden shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
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
                <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors">
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
                  <span className="text-sm font-bold text-blue-600">
                    ${product.variant.price?.toFixed(2)}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Package size={12} className="mr-1" />
                    {product.variant.inventory_level} in stock
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
              <X size={20} />
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
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-indigo-100/30 rounded-2xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 drop-shadow-sm flex items-center">
              <MessageCircle className="mr-3 text-blue-600" size={28} />
              Staff Budtender Assistant
            </h2>
            <p className="text-blue-700/80 mt-1 font-medium">
              Conversational cannabis expertise with live inventory access
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/60 rounded-lg px-3 py-2">
              <Database size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{productsWithVariants.length} Products</span>
            </div>
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="bg-white/60 border-white/50 text-blue-700 hover:bg-white/80"
            >
              Clear Chat
            </Button>
          </div>
        </div>
        
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400/30 rounded-full"></div>
        <div className="absolute bottom-3 left-3 w-1 h-1 bg-indigo-400/40 rounded-full"></div>
      </motion.div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 relative backdrop-blur-sm bg-gradient-to-br from-white/60 to-blue-50/40 rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-50/30 rounded-3xl"></div>
        
        {/* Chat messages */}
        <div 
          ref={chatContainerRef}
          className="relative z-10 overflow-y-auto p-5 space-y-4 h-96"
        >
          {chatHistory.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row' : ''}`}>
                {message.type === 'bot' && (
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-100">
                      <img
                        src="/budbuddy.png" 
                        alt="Bud" 
                        className="h-full w-full object-cover"
                      />
                    </div>
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
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm">
                      <p className="text-white leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  </>
                )}
                {message.type === 'bot' && (
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-blue-100">
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
                            className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <Target size={14} className="text-blue-600 flex-shrink-0" />
                            <span className="text-xs text-blue-700 font-medium">
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
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-100">
                  <img
                    src="/budbuddy.png" 
                    alt="Bud" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-blue-100">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative z-10 p-4 backdrop-blur-md bg-white/80 border-t border-white/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-3 border border-blue-200/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              placeholder="Ask about products, effects, inventory, or get customer consultation help..."
              disabled={isLoading || isBotTyping}
            />
            <Button 
              type="submit"
              disabled={!query.trim() || isLoading || isBotTyping}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center shadow-lg"
            >
              {isLoading || isBotTyping ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {[
          "What's good for anxiety relief?",
          "Show me our highest THC products",
          "Help with a first-time customer",
          "What terpenes are best for sleep?",
          "Check inventory levels",
          "Explain indica vs sativa",
          "Product recommendation for pain"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleQuickQuestion(suggestion)}
            disabled={isLoading || isBotTyping}
            className={`backdrop-blur-sm bg-white/60 border border-white/50 px-3 py-2 rounded-full text-sm font-medium text-blue-800 
              hover:bg-blue-50/70 hover:border-blue-200/60 transition-all duration-200 shadow-sm hover:shadow-md ${(isLoading || isBotTyping) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default StaffChatbotMode;