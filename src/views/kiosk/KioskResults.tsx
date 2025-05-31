import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Share2, Heart, MessageCircle, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { ProductWithVariant } from '../../types';
import { vibesToTerpenes } from '../../data/demoData';
import { Button } from '../../components/ui/button';

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
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
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

  // Function to handle chat submission
  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    
    // Simulate AI processing
    setIsChatLoading(true);
    
    // In a real implementation, this would call an API
    setTimeout(() => {
      // Generate a response based on the user's message
      let response = '';
      const lowerMessage = chatMessage.toLowerCase();
      
      if (lowerMessage.includes('stronger') || lowerMessage.includes('potent')) {
        response = "I understand you're looking for something more potent. Let me adjust my recommendations to focus on products with higher THC content and stronger effects.";
      } else if (lowerMessage.includes('milder') || lowerMessage.includes('gentle')) {
        response = "If you prefer a milder experience, I can suggest products with more balanced effects and lower THC levels that still provide the benefits you're seeking.";
      } else if (lowerMessage.includes('pain') || lowerMessage.includes('relief')) {
        response = "For pain relief, I'd recommend products with higher levels of caryophyllene and myrcene terpenes, which are associated with anti-inflammatory properties.";
      } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
        response = "To help with sleep, look for indica strains with high myrcene and linalool content, which promote relaxation and can help with insomnia.";
      } else if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress')) {
        response = "For anxiety and stress relief, products with balanced CBD:THC ratios and calming terpenes like linalool and limonene can be particularly effective.";
      } else {
        response = "Thanks for your feedback! I'll refine my recommendations based on your preferences. Is there anything specific about these products you'd like to know more about?";
      }
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setChatMessage('');
      setIsChatLoading(false);
    }, 1500);
  };

  const recommendationBlurb = generateRecommendationBlurb(searchQuery, providedEffects || []);

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

  const effects = providedEffects || getEffectsForQuery(searchQuery);

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
        
        <motion.p
          className="mt-4 text-lg text-gray-700 bg-white bg-opacity-60 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {recommendationBlurb}
        </motion.p>
        
        {isAIPowered && (
          <motion.div 
            className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} className="text-primary-600" />
            AI-Powered Recommendations
          </motion.div>
        )}
        
        {/* Recommendation blurb with chatbot toggle */}
        <motion.div
          className="mt-4 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm overflow-hidden"
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
              className="border-t border-gray-100"
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
                    Ask a question or provide feedback about these recommendations
                  </div>
                )}
              </div>
              
              {/* Chat input */}
              <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about these recommendations..."
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
      
      {/* Remove the standalone blurb since we've integrated it with the chatbot */}
      
      {results.length > 0 ? (
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {results.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard 
                product={product} 
                effects={effects}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item}>
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
        <motion.div
          variants={item}
          className="text-center mt-12 p-6 bg-primary-50 rounded-3xl"
        >
          <h3 className="text-2xl font-semibold mb-3">Need more guidance?</h3>
          <p className="text-gray-700 mb-4">
            Our knowledgeable staff can provide additional details about these products and help you make the perfect choice.
          </p>
          <button 
            onClick={() => setShowChatbot(true)}
            className="inline-flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm text-primary-700 font-medium hover:bg-primary-50 transition-colors"
          >
            <MessageCircle size={18} />
            Ask for assistance
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KioskResults;