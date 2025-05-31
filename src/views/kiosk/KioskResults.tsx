import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Share2, Heart, MessageCircle, Send, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { ProductWithVariant } from '../../types';
import { vibesToTerpenes } from '../../data/demoData';
import { Button } from '../../components/ui/button';
import { useProductsStore } from '../../stores/productsStore';

interface KioskResultsProps {
  searchQuery: string;
  results: ProductWithVariant[];
  onReset: () => void;
  isAIPowered?: boolean;
  effects?: string[];
}

const KioskResults = ({ 
  searchQuery, 
  results, 
  onReset,
  isAIPowered = false,
  effects: providedEffects
}: KioskResultsProps) => {
  const { searchProductsByVibe, isLoading: isSearchLoading } = useProductsStore();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [updatedResults, setUpdatedResults] = useState<ProductWithVariant[]>(results);
  const [updatedEffects, setUpdatedEffects] = useState<string[]>(providedEffects || []);
  const [updatedIsAIPowered, setUpdatedIsAIPowered] = useState<boolean>(isAIPowered);
  
  // Update local state when props change
  useEffect(() => {
    setUpdatedResults(results);
    setUpdatedEffects(providedEffects || []);
    setUpdatedIsAIPowered(isAIPowered);
  }, [results, providedEffects, isAIPowered]);
  
  // Generate a personalized recommendation blurb based on the search query
  const generateRecommendationBlurb = (query: string, effects: string[]): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check if this is an activity query
    if (lowercaseQuery.startsWith('activity:')) {
      const activity = lowercaseQuery.replace('activity:', '').trim();
      
      if (activity.includes('social') || activity.includes('party') || activity.includes('concert')) {
        return `Based on your plans for a social gathering, I've selected products that enhance connection and conversation while maintaining a comfortable energy level.`;
      } else if (activity.includes('creative') || activity.includes('art')) {
        return `For your creative session, I've found products known to spark imagination and help ideas flow while maintaining mental clarity.`;
      } else if (activity.includes('hike') || activity.includes('outdoor')) {
        return `For your outdoor adventure, these products offer energizing effects with enhanced sensory awareness to help you connect with nature.`;
      } else if (activity.includes('movie') || activity.includes('relax')) {
        return `Perfect for your relaxing movie night, these selections help you unwind and enhance your viewing experience without overwhelming effects.`;
      }
      
      return `I've selected products that complement your ${activity} plans with balanced effects for an enhanced experience.`;
    }
    
    // Handle multiple feelings (comma-separated)
    if (query.includes(',')) {
      const feelings = query.split(',').map(f => f.trim().toLowerCase());
      
      // Relaxed + Creative combination
      if (feelings.includes('relaxed') && feelings.includes('creative')) {
        return `Looking for that perfect balance of relaxation and creativity? These products offer a calm mental space while still keeping your creative energy flowing.`;
      }
      
      // Energized + Focused combination
      if (feelings.includes('energized') && feelings.includes('focused')) {
        return `For an energized yet focused state, I've selected products that provide mental clarity and motivation without the jitters or distraction.`;
      }
      
      // Pain Relief + Relaxed combination
      if (feelings.includes('pain relief') && (feelings.includes('relaxed') || feelings.includes('sleepy'))) {
        return `These therapeutic options provide physical comfort and relaxation without excessive sedation, perfect for managing discomfort while staying present.`;
      }
      
      // Generic multiple feelings
      return `Based on your desire for a combination of ${feelings.join(' and ')}, I've found products that balance these effects for a harmonious experience.`;
    }
    
    // Single feeling matches
    if (lowercaseQuery.includes('relax')) {
      return `To help you unwind and let go of tension, I've selected products with calming terpene profiles that promote a sense of peace without heavy sedation.`;
    } else if (lowercaseQuery.includes('sleep') || lowercaseQuery.includes('insomnia')) {
      return `For a restful night, these products contain terpenes like myrcene and linalool that are known to promote deep relaxation and sleep support.`;
    } else if (lowercaseQuery.includes('energy') || lowercaseQuery.includes('wake')) {
      return `Need a boost? These uplifting options feature limonene and pinene terpenes that promote alertness and positive energy without anxiety.`;
    } else if (lowercaseQuery.includes('creat')) {
      return `To spark your imagination, I've found products with terpene profiles that enhance creative thinking while maintaining mental clarity.`;
    } else if (lowercaseQuery.includes('focus')) {
      return `These selections feature terpene profiles known to enhance concentration and mental clarity, perfect for when you need to stay on task.`;
    } else if (lowercaseQuery.includes('pain') || lowercaseQuery.includes('relief')) {
      return `For physical comfort, these options contain caryophyllene and myrcene, terpenes associated with soothing properties and bodily relaxation.`;
    } else if (lowercaseQuery.includes('happy') || lowercaseQuery.includes('mood')) {
      return `To elevate your spirits, I've selected products rich in limonene and other mood-enhancing terpenes that promote a sense of well-being.`;
    } else if (lowercaseQuery.includes('social') || lowercaseQuery.includes('talk')) {
      return `For social situations, these balanced options help ease conversation while maintaining clarity and presence - perfect for connecting with others.`;
    }
    
    // Default response using the effects
    if (effects && effects.length > 0) {
      return `Based on your preferences, I've selected products that offer ${effects.join(' and ')} effects for an optimal experience.`;
    }
    
    // Generic fallback
    return `I've found some great matches based on your preferences that should provide the experience you're looking for.`;
  };

  // Function to handle chat submission with context awareness
  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    
    // Start loading state
    setIsChatLoading(true);
    
    try {
      // Generate a response based on the user's message and current context
      const lowerMessage = chatMessage.toLowerCase();
      let response = '';
      let newSearchQuery = '';
      
      // Analyze the message to determine intent and context
      if (lowerMessage.includes('concentrates')) {
        response = "You're interested in concentrates! These offer a more potent experience with higher THC levels. Let me update my recommendations to focus on our best concentrate options.";
        newSearchQuery = "concentrates " + searchQuery;
      } else if (lowerMessage.includes('flower') || lowerMessage.includes('bud')) {
        response = "Looking for flower products? Great choice for a traditional experience. I'll update my recommendations to show our best matching flower strains.";
        newSearchQuery = "flower " + searchQuery;
      } else if (lowerMessage.includes('edible')) {
        response = "Edibles provide a longer-lasting experience with no inhalation. I'll show you our best edible options that match your desired effects.";
        newSearchQuery = "edibles " + searchQuery;
      } else if (lowerMessage.includes('vape') || lowerMessage.includes('cartridge')) {
        response = "Vaporizers offer convenience and precise dosing. Here are some vape options that should provide the experience you're looking for.";
        newSearchQuery = "vaporizers " + searchQuery;
      } else if (lowerMessage.includes('stronger') || lowerMessage.includes('potent')) {
        response = "I understand you're looking for something more potent. I've updated my recommendations to focus on products with higher THC content and stronger effects.";
        newSearchQuery = "potent " + searchQuery;
      } else if (lowerMessage.includes('milder') || lowerMessage.includes('gentle')) {
        response = "If you prefer a milder experience, here are some products with more balanced effects and lower THC levels that still provide the benefits you're seeking.";
        newSearchQuery = "mild " + searchQuery;
      } else if (lowerMessage.includes('pain') || lowerMessage.includes('relief')) {
        response = "For pain relief, I recommend products with higher levels of caryophyllene and myrcene terpenes, which are associated with anti-inflammatory properties. Here are some great options.";
        newSearchQuery = "pain relief " + searchQuery;
      } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
        response = "To help with sleep, I've selected indica strains with high myrcene and linalool content, which promote relaxation and can help with insomnia.";
        newSearchQuery = "sleep " + searchQuery;
      } else if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress')) {
        response = "For anxiety and stress relief, I've found products with balanced CBD:THC ratios and calming terpenes like linalool and limonene that can be particularly effective.";
        newSearchQuery = "anxiety relief " + searchQuery;
      } else {
        // Generic response for other queries
        response = "I've analyzed your preferences and updated my recommendations. These products should better match what you're looking for based on your feedback.";
        newSearchQuery = chatMessage + " " + searchQuery;
      }
      
      // Add initial AI response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm finding products that match your request..." 
      }]);
      
      // Get new recommendations based on the updated query
      if (newSearchQuery) {
        const newResults = await searchProductsByVibe(newSearchQuery, 'kiosk');
        
        // Update the results and effects
        setUpdatedResults(newResults.products);
        setUpdatedEffects(newResults.effects);
        setUpdatedIsAIPowered(newResults.isAIPowered);
        
        // Update the last assistant message with the proper response
        setChatHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0 && newHistory[newHistory.length - 1].role === 'assistant') {
            newHistory[newHistory.length - 1].content = response;
          }
          return newHistory;
        });
      }
      
      setChatMessage('');
    } catch (error) {
      console.error('Error updating recommendations:', error);
      // Add error message to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an issue updating the recommendations. Please try again or ask something else." 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const recommendationBlurb = generateRecommendationBlurb(searchQuery, updatedEffects);

  // Determine effects based on search query if not provided
  const getEffectsForQuery = (query: string): string[] => {
    const lowercaseQuery = query.toLowerCase();
    
    // Look for direct matches in our vibe mappings
    for (const [vibe, data] of Object.entries(vibesToTerpenes)) {
      if (lowercaseQuery.includes(vibe)) {
        return data.effects;
      }
    }
    
    // Default effects if no match found
    return ['Custom Match'];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const effects = updatedEffects.length > 0 ? updatedEffects : getEffectsForQuery(searchQuery);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={item} className="mb-8">
        <button 
          onClick={onReset}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to search
        </button>
        
        <h2 className="text-4xl md:text-5xl font-display font-semibold mt-4 mb-2">
          Your perfect match
        </h2>
        <p className="text-xl text-gray-600">
          Based on your desire to feel <span className="font-semibold text-primary-600">"{searchQuery}"</span>
        </p>
        
        {updatedIsAIPowered && (
          <motion.p
            className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} className="text-primary-600" />
            AI-Powered Recommendations
          </motion.p>
        )}
        
        {/* Recommendation blurb with chatbot toggle */}
        <motion.div
          className="mt-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <p className="text-lg text-gray-700 pr-4">
                {recommendationBlurb}
              </p>
              <button 
                onClick={() => setShowChatbot(!showChatbot)}
                className="flex-shrink-0 p-2 text-primary-600 hover:text-primary-800 transition-colors rounded-full hover:bg-primary-50"
                aria-label={showChatbot ? "Hide chat" : "Show chat"}
              >
                {showChatbot ? <ChevronUp size={20} /> : <MessageCircle size={20} />}
              </button>
            </div>
          </div>
          
          {/* Chatbot interface */}
          {showChatbot && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 bg-white bg-opacity-90"
            >
              {/* Chat history */}
              <div className="max-h-60 overflow-y-auto p-4 space-y-3">
                {chatHistory.length > 0 ? (
                  chatHistory.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.role === 'user' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    Ask about specific products, categories, or effects
                  </div>
                )}
                
                {/* Loading indicator for chat */}
                {isChatLoading && (
                  <div className="flex justify-center py-2">
                    <div className="flex items-center space-x-2 text-primary-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Updating recommendations...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat input */}
              <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about concentrates, flower, edibles, etc..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleChatSubmit();
                    }
                  }}
                  disabled={isChatLoading}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={!chatMessage.trim() || isChatLoading}
                  className={`p-2 rounded-lg ${
                    chatMessage.trim() && !isChatLoading
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isChatLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Loading indicator for product updates */}
      {isSearchLoading && (
        <motion.div 
          className="flex justify-center items-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            <p className="text-primary-600">Updating recommendations...</p>
          </div>
        </motion.div>
      )}
      
      {!isSearchLoading && updatedResults.length > 0 ? (
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {updatedResults.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard 
                product={product} 
                effects={effects}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !isSearchLoading && <motion.div variants={item}>
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">No perfect matches right now</h3>
            <p className="text-gray-600 mb-6">
              We're out of that specific vibe at the moment, but our staff can help you find something similar.
            </p>
            <Button onClick={onReset}>Try another search</Button>
          </div>
        </motion.div>
      )}

      {!showChatbot && (
        <motion.button
          onClick={() => setShowChatbot(true)}
          variants={item}
          className="w-full text-center mt-12 p-6 bg-primary-50 rounded-3xl hover:bg-primary-100 transition-colors"
        >
          <h3 className="text-2xl font-semibold mb-3">Need more guidance?</h3>
          <p className="text-gray-700 mb-4">
            Ask about specific products, categories, or effects to refine your recommendations.
          </p>
          <div className="inline-flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm text-primary-700 font-medium">
            <MessageCircle size={18} />
            Click to chat with LeafIQ
          </div>
        </motion.button>
      )}
    </motion.div>
  );
};

export default KioskResults;