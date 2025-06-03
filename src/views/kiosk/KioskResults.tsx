import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Share2, Heart, MessageCircle, Send, ChevronDown, ChevronUp, Sparkles, Loader2, Bot, Leaf, Package, Zap, FlaskConical, Palette } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import ProductDetailsModal from '../admin/components/ProductDetailsModal';
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
  
  // Debug logging for props
  console.log('🎨 KioskResults props received:', {
    searchQuery,
    resultsLength: results.length,
    isAIPowered,
    effects: providedEffects,
    firstResult: results[0] ? {
      name: results[0].name,
      hasVariant: !!results[0].variant,
      variantFields: results[0].variant ? Object.keys(results[0].variant) : null
    } : null
  });
  const { searchProductsByVibe, isLoading: isSearchLoading } = useProductsStore();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [updatedResults, setUpdatedResults] = useState<ProductWithVariant[]>(results);
  const [updatedEffects, setUpdatedEffects] = useState<string[]>(providedEffects || []);
  const [updatedIsAIPowered, setUpdatedIsAIPowered] = useState<boolean>(isAIPowered);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  
  // Update local state when props change
  useEffect(() => {
    setUpdatedResults(results);
    setUpdatedEffects(providedEffects || []);
    setUpdatedIsAIPowered(isAIPowered);
  }, [results, providedEffects, isAIPowered]);
  
  // Helper function to format chat responses with rich product cards
  const formatChatResponse = (content: string) => {
    // Split response into sections
    const sections = content.split('\n\n');
    
    return sections.map((section, idx) => {
      // Check if it's a product recommendation
      if (section.includes('•')) {
        const lines = section.split('\n').filter(line => line.trim());
        const header = lines[0];
        const recommendations = lines.slice(1);
        
        return (
          <div key={idx} className="mb-4">
            <p className="text-gray-700 font-medium mb-3">{header}</p>
            <div className="space-y-2">
              {recommendations.map((rec, recIdx) => {
                // Parse recommendation details
                const match = rec.match(/• (.+?) by (.+?) \((.+?)\) - (.+?) at (.+?)(?:\. (.+))?/);
                if (match) {
                  const [_, name, brand, cannabinoids, stock, price, terpenes] = match;
                  const [thc, cbd] = cannabinoids.split(', ');
                  const stockLevel = parseInt(stock);
                  const stockColor = stockLevel > 15 ? 'text-green-600' : stockLevel > 5 ? 'text-yellow-600' : 'text-orange-600';
                  
                  // Find the actual product object
                  const product = updatedResults.find(p => 
                    p.name === name && p.brand === brand
                  );
                  
                  return (
                    <motion.div
                      key={recIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: recIdx * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl overflow-hidden border border-green-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => product && setSelectedProduct(product)}
                    >
                      <div className="flex">
                        {product?.image_url && (
                          <div className="w-28 h-28 flex-shrink-0">
                            <img 
                              src={product.image_url} 
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{name}</h4>
                              <p className="text-sm text-gray-600">by {brand}</p>
                            </div>
                            <span className="text-lg font-bold text-green-600">{price}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {thc && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                {thc}
                              </span>
                            )}
                            {cbd && cbd !== '0.0% CBD' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {cbd}
                              </span>
                            )}
                            <span className={`px-2 py-1 bg-gray-100 text-xs rounded-full font-medium ${stockColor}`}>
                              {stock}
                            </span>
                          </div>
                          
                          {terpenes && (
                            <p className="text-xs text-gray-600 italic">
                              <Palette className="inline w-3 h-3 mr-1" />
                              {terpenes}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }
                return <div key={recIdx} className="text-sm text-gray-700">{rec}</div>;
              })}
            </div>
          </div>
        );
      }
      
      // Regular text paragraph
      return (
        <motion.p 
          key={idx} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="text-gray-700 leading-relaxed mb-3"
        >
          {section}
        </motion.p>
      );
    });
  };

  // Generate a personalized recommendation blurb based on the search query
  const generateRecommendationBlurb = (query: string, effects: string[]): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check if this is a cannabis question
    if (lowercaseQuery.startsWith('cannabis question:')) {
      // For cannabis education questions, no product recommendation blurb needed
      if (updatedResults.length === 0) {
        return `Thanks for your question about cannabis. While I don't have specific products to recommend based on your question, I'm happy to provide information and education.`;
      }
      
      // If we do have product results to show
      return `Based on your cannabis question, here are some products that might be relevant. Feel free to ask more questions about specific products or cannabis topics.`;
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
    } else if (lowercaseQuery.includes('concentrates') || lowercaseQuery.includes('concentrate')) {
      return `For a more potent experience, I've selected premium concentrates with high THC content and rich terpene profiles that deliver powerful effects.`;
    }
    
    // Handle cannabis education questions
    if (lowercaseQuery.includes('thc') || lowercaseQuery.includes('cbd') || 
        lowercaseQuery.includes('terpene') || lowercaseQuery.includes('strain') ||
        lowercaseQuery.includes('edible') || lowercaseQuery.includes('effect')) {
      return `I'm happy to provide information about cannabis. Feel free to ask follow-up questions for more details on this topic.`;
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
      let categoryFilter = '';
      
      // Analyze the message to determine intent and context
      if (lowerMessage.includes('concentrates') || lowerMessage.includes('concentrate')) {
        response = "You're interested in concentrates! These offer a more potent experience with higher THC levels. Let me update my recommendations to focus on our best concentrate options.";
        newSearchQuery = searchQuery;
        categoryFilter = "concentrate"; // Set category filter to concentrates
      } else if (lowerMessage.includes('flower') || lowerMessage.includes('bud')) {
        response = "Looking for flower products? Great choice for a traditional experience. I'll update my recommendations to show our best matching flower strains.";
        newSearchQuery = searchQuery;
        categoryFilter = "flower"; // Set category filter to flower
      } else if (lowerMessage.includes('edible')) {
        response = "Edibles provide a longer-lasting experience with no inhalation. I'll show you our best edible options that match your desired effects.";
        newSearchQuery = searchQuery;
        categoryFilter = "edible"; // Set category filter to edibles
      } else if (lowerMessage.includes('vape') || lowerMessage.includes('cartridge')) {
        response = "Vaporizers offer convenience and precise dosing. Here are some vape options that should provide the experience you're looking for.";
        newSearchQuery = searchQuery;
        categoryFilter = "vaporizer"; // Set category filter to vaporizers
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
      } else if (lowerMessage.includes('what is') || lowerMessage.includes('how does') || lowerMessage.includes('explain') || 
                lowerMessage.includes('tell me about') || lowerMessage.includes('difference between')) {
        // This is likely an educational question - handle differently
        response = getEducationalResponse(lowerMessage);
        // For educational questions, we might not need to update product results
        if (lowerMessage.includes('thc') || lowerMessage.includes('cbd') || lowerMessage.includes('terpene')) {
          newSearchQuery = "cannabis education";
        }
      } else {
        // Generic response for other queries
        response = "I've analyzed your preferences and updated my recommendations. These products should better match what you're looking for based on your feedback.";
        newSearchQuery = chatMessage + " " + searchQuery;
      }
      
      // Add initial AI response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response 
      }]);
      
      // Get new recommendations based on the updated query
      if (newSearchQuery) {
        const newResults = await searchProductsByVibe(newSearchQuery, 'kiosk');
        let filteredResults = newResults.products;
        
        // Apply category filter if specified
        if (categoryFilter) {
          // Filter products by the specified category
          filteredResults = filteredResults.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
          
          // If no products match the category filter, try to find products from that category 
          // that match the original query
          if (filteredResults.length === 0) {
            const categoryResults = await searchProductsByVibe(categoryFilter, 'kiosk');
            filteredResults = categoryResults.products.filter(p => 
              p.category.toLowerCase() === categoryFilter.toLowerCase()
            );
          }
        }
        
        // Update the results and effects
        setUpdatedResults(filteredResults);
        setUpdatedEffects(newResults.effects);
        setUpdatedIsAIPowered(newResults.isAIPowered);
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
  
  // Function to generate educational responses about cannabis
  const getEducationalResponse = (query: string): string => {
    // Check for common educational questions
    if (query.includes('thc')) {
      return "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that creates the 'high' sensation. It works by binding to cannabinoid receptors in the brain, affecting things like thinking, memory, pleasure, coordination, and time perception. Different cannabis strains contain varying levels of THC, which influences the intensity and character of effects you'll experience.";
    } else if (query.includes('cbd')) {
      return "CBD (cannabidiol) is a non-psychoactive compound found in cannabis. Unlike THC, it doesn't produce a high. CBD is often used for anxiety, insomnia, and pain relief, and has anti-inflammatory properties. Many users prefer CBD for therapeutic benefits without intoxication. Research suggests CBD may help with epilepsy, inflammation, anxiety, and various other conditions, though studies are ongoing.";
    } else if (query.includes('terpene')) {
      return "Terpenes are aromatic compounds found in cannabis and many other plants. They give cannabis its distinctive smell and taste but also play a key role in effects. Different terpenes like myrcene (relaxing), limonene (uplifting), and pinene (focusing) contribute to the unique experience of each strain. The 'entourage effect' describes how terpenes work together with cannabinoids to create specific effects beyond what any single compound would produce.";
    } else if (query.includes('indica') || query.includes('sativa') || (query.includes('difference') && query.includes('strain'))) {
      return "Traditionally, Indica strains are associated with relaxing, sedative effects ('in-da-couch'), while Sativa strains are linked to energizing, cerebral effects. However, modern cannabis science looks beyond this simplistic divide to terpene profiles and cannabinoid ratios, which more accurately predict effects than strain type alone. Hybrids combine characteristics of both types. The specific effect of any strain depends on its unique chemical profile rather than just its classification.";
    } else if (query.includes('edible') && (query.includes('dosing') || query.includes('dose'))) {
      return "When dosing edibles, start low (5-10mg THC) and go slow. Edibles can take 30-90 minutes to take effect and last 4-8 hours. Unlike smoking, edibles are processed by your liver, creating a stronger, longer-lasting effect. Wait at least 2 hours before considering more, as effects can intensify over time. New users should begin with 2-5mg THC. Everyone's metabolism processes cannabinoids differently, so personal experience may vary.";
    } else if (query.includes('medical') || query.includes('medicine')) {
      return "Medical cannabis is used to treat various conditions including chronic pain, nausea, muscle spasms, anxiety, insomnia, and more. Different cannabinoids and terpenes target different symptoms - THC may help with pain and nausea, while CBD can address inflammation and anxiety. Always consult a healthcare provider about medical cannabis use, especially regarding potential interactions with other medications and appropriate dosing protocols.";
    } else if (query.includes('consume') || query.includes('method') || query.includes('use')) {
      return "Cannabis can be consumed in several ways: (1) Inhalation through smoking or vaporizing provides quick effects (within minutes) that typically last 2-3 hours; (2) Edibles and ingestible oils offer longer-lasting effects (4-8 hours) but take 30-90 minutes to begin working; (3) Tinctures applied under the tongue act within 15-45 minutes; (4) Topicals applied to the skin provide localized relief without psychoactive effects. Each method has different onset times, durations, and intensity profiles.";
    } else if (query.includes('store') || query.includes('storage')) {
      return "For optimal cannabis storage: (1) Keep products in airtight containers to prevent air exposure that degrades cannabinoids and terpenes; (2) Store in a cool, dark place as light and heat accelerate degradation; (3) Maintain moderate humidity (59-63% for flower); (4) Keep away from electronics and appliances that generate heat; (5) Always store out of reach of children and pets. Properly stored flower can maintain potency for 6-12 months, while concentrates and edibles generally have longer shelf lives.";
    } else if (query.includes('tolerance') && query.includes('break')) {
      return "A tolerance break ('t-break') is a period of abstaining from cannabis to reset your body's cannabinoid receptors. Even 48 hours can begin to restore sensitivity, but 1-2 weeks is typically more effective. During this time, stay hydrated, exercise to release stored cannabinoids, and get plenty of sleep. Some users report improved effects, reduced consumption needs, and greater clarity after returning to cannabis. T-breaks can also be a good opportunity to reflect on your relationship with cannabis.";
    } else if (query.includes('entourage') || query.includes('effect')) {
      return "The entourage effect refers to how cannabis compounds work together synergistically to produce effects that differ from any single isolated compound. This interaction between cannabinoids (like THC and CBD), terpenes, and other plant compounds creates unique therapeutic profiles. For example, CBD can moderate THC's psychoactive effects, while terpenes like myrcene may enhance THC absorption. This concept explains why whole-plant or full-spectrum products often provide different experiences than isolated compounds.";
    }
    
    // Default educational response
    return "That's a great question about cannabis. Cannabis contains over 100 cannabinoids and numerous terpenes that work together to create different effects. The specific effects depend on the chemical profile of the strain, your individual endocannabinoid system, consumption method, and dosage. I'm happy to provide more specific information if you have questions about particular aspects of cannabis.";
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
        
        {/* Enhanced AI Assistant Section */}
        <motion.div
          className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="h-14 w-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0"
                >
                  <img src="/budbuddy.png" alt="Bud" className="h-12 w-12 object-contain" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Your Personal Cannabis Guide</h3>
                  <p className="text-gray-700 pr-4">
                    {recommendationBlurb}
                  </p>
                </div>
              </div>
              <motion.button 
                onClick={() => setShowChatbot(!showChatbot)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                aria-label={showChatbot ? "Hide chat" : "Show chat"}
              >
                {showChatbot ? <ChevronUp size={24} className="text-green-600" /> : <MessageCircle size={24} className="text-green-600" />}
              </motion.button>
            </div>
          </div>
          
          {/* Enhanced Chatbot Interface */}
          {showChatbot && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white bg-opacity-95"
            >
              {/* Welcome Message for Empty State */}
              {chatHistory.length === 0 && (
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 mb-3">
                        Hi! I'm Bud, your personal cannabis guide. 🌿
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        I can help you explore different options based on:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Package className="h-4 w-4 text-green-500" />
                          <span>Product types</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>Desired effects</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FlaskConical className="h-4 w-4 text-blue-500" />
                          <span>THC/CBD levels</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Palette className="h-4 w-4 text-purple-500" />
                          <span>Terpene profiles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Chat history with dynamic height */}
              <div 
                className="overflow-y-auto p-6 space-y-4"
                style={{ 
                  minHeight: '200px',
                  maxHeight: chatHistory.length > 3 ? '450px' : '300px',
                  height: 'auto'
                }}
              >
                {chatHistory.map((message, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                        <Bot className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'flex-1'}`}>
                      {message.role === 'user' ? (
                        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-2xl">
                          {message.content}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formatChatResponse(message.content)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Loading indicator for chat */}
                {isChatLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Finding perfect matches for you...</span>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Enhanced Chat Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-start gap-3">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask me anything! Try 'Show me energizing sativas' or 'What's good for sleep?'"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    disabled={isChatLoading}
                  />
                  <motion.button
                    onClick={handleChatSubmit}
                    disabled={!chatMessage.trim() || isChatLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-2xl flex items-center justify-center ${
                      chatMessage.trim() && !isChatLoading
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-all`}
                  >
                    {isChatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </motion.button>
                </div>
                
                {/* Enhanced Quick Suggestions */}
                <div className="mt-4 space-y-3">
                  <p className="text-center text-gray-600 text-sm font-medium">Popular questions to get you started</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("Show me your strongest concentrates")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <span className="text-lg">💪</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            Strongest options
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            High-potency products for experienced users
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("What's best for first-time users?")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <span className="text-lg">🌱</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            First-timer friendly
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Gentle options perfect for beginners
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("Tell me about terpenes")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <span className="text-lg">🧪</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            Learn about terpenes
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Understanding cannabis aromatics and effects
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("What is THC and CBD?")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            THC vs CBD
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Understanding cannabinoids and their effects
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("How do edibles work differently?")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            How edibles work
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Dosing, timing, and safety tips
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("Indica vs Sativa - what's the difference?")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <FlaskConical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            Indica vs Sativa
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Understanding strain classifications
                          </p>
                        </div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        boxShadow: "0 8px 25px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChatMessage("What should I know about dosing?")}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                            Safe dosing tips
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">
                            Start low, go slow, and more guidance
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* AI-Powered Recommendations badge */}
          {updatedIsAIPowered && (
            <motion.div
              className="mt-3 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                <Sparkles size={16} className="text-green-600" />
                <span>Personalized by AI • Powered by Real Inventory</span>
                <Leaf size={16} className="text-green-600" />
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
                effects={updatedEffects}
                onProductSelect={setSelectedProduct}
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

      {!showChatbot && updatedResults.length > 0 && (
        <motion.button
          onClick={() => setShowChatbot(true)}
          variants={item}
          className="w-full text-center mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <img src="/budbuddy.png" alt="Bud" className="h-14 w-14 object-contain" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-800">Want personalized recommendations?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            I'm here to help you find exactly what you're looking for. Ask me about specific effects, product types, or let me guide you to the perfect match!
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white font-semibold"
          >
            <MessageCircle size={20} />
            <span>Chat with your Cannabis Guide</span>
            <Sparkles size={18} />
          </motion.div>
        </motion.button>
      )}
      
      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => {}} // No-op for customer kiosk
          showEditButton={false}
        />
      )}
    </motion.div>
  );
};

export default KioskResults;