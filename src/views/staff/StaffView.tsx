import { useState, useEffect } from "react";
import { useSimpleAuthStore } from "../../stores/simpleAuthStore";
import { useProductsStore } from "../../stores/productsStore";
import { useStaffModeStore } from "../../stores/staffModeStore";
import { StaffHeader } from "../../components/staff/StaffHeader";
import { StaffModeSelector } from "../../components/staff/StaffModeSelector";
import { ProductSearchMode } from "../../components/staff/modes/ProductSearchMode";
import { TerpeneExplorerMode } from "../../components/staff/modes/TerpeneExplorerMode";
import StaffInventoryMode from "../../components/staff/modes/StaffInventoryMode";
import ProductDetailsModal from "../../views/admin/components/ProductDetailsModal";
import { Button } from "../../components/ui/button"; 
import {
  Bot,
  Package,
  Users,
  BookOpen,
  BarChart3,
  Construction,
  Leaf,
  Zap,
  FlaskConical,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductWithVariant } from "../../types";

// Placeholder components for modes not yet implemented
const PlaceholderMode = ({ mode }: { mode: string }) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
    <Construction size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-2xl font-semibold mb-4">{mode} Mode</h3>
    <p className="text-gray-600 mb-6">
      This mode is coming soon! Check back later for powerful new features.
    </p>
    <Button variant="outline">Request Early Access</Button>
  </div>
);

// Bud AI Budtender Component
const BudAIBudtenderMode = ({ productsWithVariants }: { productsWithVariants: ProductWithVariant[] }) => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariant | null>(null);
  
  // Helper function to analyze inventory for specific needs
  const analyzeInventoryForNeed = (need: string) => {
    const availableProducts = productsWithVariants.filter((p: ProductWithVariant) => 
      p.variant?.is_available && p.variant?.inventory_level > 0
    );
    
    if (need.includes('anxiety')) {
      // Look for high CBD products or balanced ratios, and calming terpenes
      return availableProducts
        .filter((p: ProductWithVariant) => {
          const variant = p.variant;
          const hasCalming = variant?.terpene_profile && (
            (variant.terpene_profile as any).linalool > 0.1 ||
            (variant.terpene_profile as any).caryophyllene > 0.1 ||
            (variant.terpene_profile as any).myrcene > 0.2
          );
          const hasGoodRatio = variant?.cbd_percentage && variant.cbd_percentage > 0.5 || 
            (variant?.thc_percentage && variant?.cbd_percentage && 
             variant.thc_percentage / variant.cbd_percentage < 3);
          
          return hasCalming || hasGoodRatio;
        })
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.cbd_percentage || 0) - (a.variant?.cbd_percentage || 0))
        .slice(0, 3);
    }
    
    if (need.includes('indica')) {
      return availableProducts
        .filter((p: ProductWithVariant) => p.strain_type === 'indica')
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (need.includes('sativa')) {
      return availableProducts
        .filter((p: ProductWithVariant) => p.strain_type === 'sativa')
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (need.includes('pain')) {
      return availableProducts
        .filter((p: ProductWithVariant) => {
          const variant = p.variant;
          const hasPainTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile as any).caryophyllene > 0.15 ||
            (variant.terpene_profile as any).myrcene > 0.2 ||
            (variant.terpene_profile as any).pinene > 0.1
          );
          const hasHighTHC = variant?.thc_percentage && variant.thc_percentage > 15;
          
          return hasPainTerpenes || hasHighTHC;
        })
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (need.includes('sleep') || need.includes('insomnia')) {
      return availableProducts
        .filter((p: ProductWithVariant) => {
          const variant = p.variant;
          const hasSleepTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile as any).myrcene > 0.3 ||
            (variant.terpene_profile as any).linalool > 0.1
          );
          const isIndica = p.strain_type === 'indica';
          
          return hasSleepTerpenes || isIndica;
        })
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.thc_percentage || 0) - (a.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    if (need.includes('energy') || need.includes('focus')) {
      return availableProducts
        .filter((p: ProductWithVariant) => {
          const variant = p.variant;
          const hasEnergyTerpenes = variant?.terpene_profile && (
            (variant.terpene_profile as any).limonene > 0.1 ||
            (variant.terpene_profile as any).pinene > 0.1 ||
            (variant.terpene_profile as any).terpinolene > 0.05
          );
          const isSativa = p.strain_type === 'sativa';
          
          return hasEnergyTerpenes || isSativa;
        })
        .sort((a: ProductWithVariant, b: ProductWithVariant) => (a.variant?.thc_percentage || 0) - (b.variant?.thc_percentage || 0))
        .slice(0, 3);
    }
    
    // Default: return top 3 most popular (highest inventory)
    return availableProducts
      .sort((a: ProductWithVariant, b: ProductWithVariant) => (b.variant?.inventory_level || 0) - (a.variant?.inventory_level || 0))
      .slice(0, 3);
  };
  
  // Helper function to format product recommendations
  const formatProductRecommendation = (product: ProductWithVariant) => {
    const variant = product.variant;
    const thc = variant?.thc_percentage ? `${variant.thc_percentage.toFixed(1)}% THC` : 'THC info unavailable';
    const cbd = variant?.cbd_percentage && variant.cbd_percentage > 0 ? `, ${variant.cbd_percentage.toFixed(1)}% CBD` : '';
    const stock = variant?.inventory_level || 0;
    const price = variant?.price ? `$${variant.price.toFixed(2)}` : 'Price varies';
    
    const topTerpenes = variant?.terpene_profile ? 
      Object.entries(variant.terpene_profile)
        .filter(([_, value]) => (value as number) > 0.05)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 2)
        .map(([name, _]) => name)
        .join(', ') : '';
    
    return `${product.name} by ${product.brand} (${thc}${cbd}) - ${stock} units in stock at ${price}${topTerpenes ? `. Rich in ${topTerpenes} terpenes` : ''}`;
  };

  const handleAskBud = async () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    setResponse('');
    
    // Simulate AI response with timeout
    setTimeout(() => {
      // Generate appropriate response based on question content and real inventory
      let aiResponse = "I'm happy to help! ";
      const questionLower = question.toLowerCase();
      
      if (questionLower.includes("terpene")) {
        aiResponse += "Terpenes are aromatic compounds found in cannabis and many other plants. They give cannabis its distinctive smell and flavor, and also contribute to the effects you feel. The most common terpenes in cannabis include myrcene (relaxing), limonene (uplifting), pinene (focusing), and caryophyllene (pain relief).";
        
        // Add current inventory with notable terpenes
        const terpeneRichProducts = productsWithVariants
          .filter((p: ProductWithVariant) => p.variant?.terpene_profile && Object.keys(p.variant.terpene_profile).length > 0)
          .slice(0, 3);
        
        if (terpeneRichProducts.length > 0) {
          aiResponse += "\n\nFrom our current inventory, here are some products with notable terpene profiles:\n";
          terpeneRichProducts.forEach((product: ProductWithVariant) => {
            const topTerpene = product.variant?.terpene_profile ? 
              Object.entries(product.variant.terpene_profile)
                .sort(([,a], [,b]) => (b as number) - (a as number))[0] : null;
            if (topTerpene) {
              aiResponse += `• ${product.name} - Rich in ${topTerpene[0]} (${((topTerpene[1] as number) * 100).toFixed(1)}%)\n`;
            }
          });
        }
      } else if (questionLower.includes("thc") && questionLower.includes("cbd")) {
        aiResponse += "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the 'high' sensation. CBD (cannabidiol) is non-intoxicating and often used for therapeutic benefits like anxiety and pain relief. THC binds directly to CB1 receptors in the brain, while CBD works more indirectly on the endocannabinoid system.";
      } else if (questionLower.includes("anxiety")) {
        const anxietyProducts = analyzeInventoryForNeed("anxiety");
        aiResponse += "For customers seeking anxiety relief, consider recommending products with balanced THC:CBD ratios or higher CBD content. Strains rich in linalool and caryophyllene terpenes often have calming effects.";
        
        if (anxietyProducts.length > 0) {
          aiResponse += "\n\nBased on our current inventory, here are my top recommendations for anxiety relief:\n";
          anxietyProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nI don't see any products specifically suited for anxiety relief in our current inventory. You might want to check with management about stocking some high-CBD or balanced ratio products.";
        }
      } else if (questionLower.includes("indica")) {
        const indicaProducts = analyzeInventoryForNeed("indica");
        aiResponse += "Indica strains are typically associated with relaxing, sedating effects that are great for evening use and sleep.";
        
        if (indicaProducts.length > 0) {
          aiResponse += "\n\nHere are our current indica strains in stock:\n";
          indicaProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nWe don't currently have any indica strains in stock. Consider recommending hybrid strains with relaxing terpene profiles as alternatives.";
        }
      } else if (questionLower.includes("sativa")) {
        const sativaProducts = analyzeInventoryForNeed("sativa");
        aiResponse += "Sativa strains are typically associated with energizing, uplifting effects that are great for daytime use and creative activities.";
        
        if (sativaProducts.length > 0) {
          aiResponse += "\n\nHere are our current sativa strains in stock:\n";
          sativaProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nWe don't currently have any pure sativa strains in stock. Consider recommending hybrid strains with energizing terpene profiles as alternatives.";
        }
      } else if (questionLower.includes("pain")) {
        const painProducts = analyzeInventoryForNeed("pain");
        aiResponse += "For pain relief, customers often benefit from products with higher THC content and terpenes like caryophyllene, myrcene, and pinene.";
        
        if (painProducts.length > 0) {
          aiResponse += "\n\nBased on our current inventory, here are my recommendations for pain relief:\n";
          painProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nI don't see optimal pain relief products in our current inventory. Look for products with high THC or significant caryophyllene content.";
        }
      } else if (questionLower.includes("sleep") || questionLower.includes("insomnia")) {
        const sleepProducts = analyzeInventoryForNeed("sleep");
        aiResponse += "For sleep issues, recommend products with high myrcene or linalool content, or indica-dominant strains with relaxing effects.";
        
        if (sleepProducts.length > 0) {
          aiResponse += "\n\nHere are my top recommendations for sleep from our current inventory:\n";
          sleepProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nWe don't currently have optimal sleep-focused products. Consider any indica strains or products with relaxing terpene profiles.";
        }
      } else if (questionLower.includes("energy") || questionLower.includes("focus")) {
        const energyProducts = analyzeInventoryForNeed("energy");
        aiResponse += "For energy and focus, recommend sativa strains or products rich in limonene, pinene, or terpinolene.";
        
        if (energyProducts.length > 0) {
          aiResponse += "\n\nHere are my recommendations for energy and focus from our current inventory:\n";
          energyProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        } else {
          aiResponse += "\n\nWe don't currently have optimal energizing products. Consider any sativa strains or products with uplifting terpene profiles.";
        }
      } else if (questionLower.includes("popular") || questionLower.includes("best seller")) {
        const popularProducts = analyzeInventoryForNeed("popular");
        aiResponse += "Here are our most popular products based on current inventory levels and customer demand:";
        
        if (popularProducts.length > 0) {
          aiResponse += "\n";
          popularProducts.forEach((product: ProductWithVariant) => {
            aiResponse += `• ${formatProductRecommendation(product)}\n`;
          });
        }
      } else {
        const availableCount = productsWithVariants.filter((p: ProductWithVariant) => 
          p.variant?.is_available && p.variant?.inventory_level > 0
        ).length;
        
        aiResponse += `I can provide information about cannabis products, effects, consumption methods, and help you make recommendations to customers. We currently have ${availableCount} products in stock. Feel free to ask specific questions about strains, terpenes, effects, or customer scenarios.`;
      }
      
      setResponse(aiResponse);
      setIsSubmitting(false);
    }, 1500);
  };

  // Handle suggestion click to automatically fill and submit the question
  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    
    // Submit the question after a short delay to allow state update
    setTimeout(() => {
      setResponse('');
      setIsSubmitting(true);
      
      // Simulate AI response with timeout using the same logic as handleAskBud
      setTimeout(() => {
        // Use the same logic as handleAskBud but with the suggestion
        let aiResponse = "I'm happy to help! ";
        const suggestionLower = suggestion.toLowerCase();
        
        if (suggestionLower.includes("terpenes")) {
          aiResponse += "Terpenes are aromatic compounds found in cannabis and many other plants. They give cannabis its distinctive smell and flavor, and also contribute to the effects you feel. The most common terpenes in cannabis include myrcene (relaxing), limonene (uplifting), pinene (focusing), and caryophyllene (pain relief).";
          
          // Add current inventory with notable terpenes
          const terpeneRichProducts = productsWithVariants
            .filter((p: ProductWithVariant) => p.variant?.terpene_profile && Object.keys(p.variant.terpene_profile).length > 0)
            .slice(0, 3);
          
          if (terpeneRichProducts.length > 0) {
            aiResponse += "\n\nFrom our current inventory, here are some products with notable terpene profiles:\n";
            terpeneRichProducts.forEach((product: ProductWithVariant) => {
              const topTerpene = product.variant?.terpene_profile ? 
                Object.entries(product.variant.terpene_profile)
                  .sort(([,a], [,b]) => (b as number) - (a as number))[0] : null;
              if (topTerpene) {
                aiResponse += `• ${product.name} - Rich in ${topTerpene[0]} (${((topTerpene[1] as number) * 100).toFixed(1)}%)\n`;
              }
            });
          }
        } else if (suggestionLower.includes("thc") && suggestionLower.includes("cbd")) {
          aiResponse += "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the 'high' sensation. CBD (cannabidiol) is non-intoxicating and often used for therapeutic benefits like anxiety and pain relief. THC binds directly to CB1 receptors in the brain, while CBD works more indirectly on the endocannabinoid system.";
        } else if (suggestionLower.includes("anxiety")) {
          const anxietyProducts = analyzeInventoryForNeed("anxiety");
          aiResponse += "For customers seeking anxiety relief, consider recommending products with balanced THC:CBD ratios or higher CBD content. Strains rich in linalool and caryophyllene terpenes often have calming effects.";
          
          if (anxietyProducts.length > 0) {
            aiResponse += "\n\nBased on our current inventory, here are my top recommendations for anxiety relief:\n";
            anxietyProducts.forEach((product: ProductWithVariant) => {
              aiResponse += `• ${formatProductRecommendation(product)}\n`;
            });
          } else {
            aiResponse += "\n\nI don't see any products specifically suited for anxiety relief in our current inventory. You might want to check with management about stocking some high-CBD or balanced ratio products.";
          }
        } else if (suggestionLower.includes("indica")) {
          const indicaProducts = analyzeInventoryForNeed("indica");
          aiResponse += "Indica strains are typically associated with relaxing, sedating effects that are great for evening use and sleep.";
          
          if (indicaProducts.length > 0) {
            aiResponse += "\n\nHere are our current indica strains in stock:\n";
            indicaProducts.forEach((product: ProductWithVariant) => {
              aiResponse += `• ${formatProductRecommendation(product)}\n`;
            });
          } else {
            aiResponse += "\n\nWe don't currently have any indica strains in stock. Consider recommending hybrid strains with relaxing terpene profiles as alternatives.";
          }
        } else if (suggestionLower.includes("sleep")) {
          const sleepProducts = analyzeInventoryForNeed("sleep");
          aiResponse += "For sleep issues, recommend products with high myrcene or linalool content, or indica-dominant strains with relaxing effects.";
          
          if (sleepProducts.length > 0) {
            aiResponse += "\n\nHere are my top recommendations for sleep from our current inventory:\n";
            sleepProducts.forEach((product: ProductWithVariant) => {
              aiResponse += `• ${formatProductRecommendation(product)}\n`;
            });
          } else {
            aiResponse += "\n\nWe don't currently have optimal sleep-focused products. Consider any indica strains or products with relaxing terpene profiles.";
          }
        } else if (suggestionLower.includes("energizing")) {
          const energyProducts = analyzeInventoryForNeed("energy");
          aiResponse += "For energy and focus, recommend sativa strains or products rich in limonene, pinene, or terpinolene.";
          
          if (energyProducts.length > 0) {
            aiResponse += "\n\nHere are my recommendations for energy and focus from our current inventory:\n";
            energyProducts.forEach((product: ProductWithVariant) => {
              aiResponse += `• ${formatProductRecommendation(product)}\n`;
            });
          } else {
            aiResponse += "\n\nWe don't currently have optimal energizing products. Consider any sativa strains or products with uplifting terpene profiles.";
          }
        }
        
        setResponse(aiResponse);
        setIsSubmitting(false);
      }, 1500);
    }, 100);
  };

  // Helper function to format the response with rich styling
  const formatResponseContent = (content: string) => {
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
                  const product = productsWithVariants.find(p => 
                    p.name === name && p.brand === brand
                  );
                  
                  return (
                    <motion.div
                      key={recIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: recIdx * 0.1 }}
                      className="bg-white rounded-xl overflow-hidden border border-purple-100 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => product && setSelectedProduct(product)}
                    >
                      <div className="flex">
                        {product?.image_url && (
                          <div className="w-24 h-24 flex-shrink-0">
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
                            <span className="text-lg font-bold text-purple-600">{price}</span>
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

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 shadow-xl border border-purple-200">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="h-12 w-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
        >
          <img src="/budbuddy.png" alt="Bud" className="h-10 w-10 object-contain" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bud AI Budtender</h2>
          <p className="text-sm text-gray-600">Your intelligent cannabis assistant</p>
        </div>
      </div>

      {/* Chat Display */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 mb-6 min-h-[200px] shadow-inner">
        {response ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                {formatResponseContent(response)}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start space-x-3"
          >
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">
                Hello! I'm Bud, your AI budtender assistant. 👋
              </p>
              <p className="text-gray-600 mt-2">
                I have access to our <span className="font-semibold text-purple-600">entire inventory database</span> and can help you find the perfect products for your customers based on:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Desired effects</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FlaskConical className="h-4 w-4 text-blue-500" />
                  <span>THC/CBD ratios</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Palette className="h-4 w-4 text-purple-500" />
                  <span>Terpene profiles</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-green-500" />
                  <span>Live inventory</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && question.trim() && !isSubmitting) {
                e.preventDefault();
                handleAskBud();
              }
            }}
            className="w-full p-4 pr-24 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-gray-700 bg-white bg-opacity-90"
            rows={3}
            placeholder="Ask me anything about our products, effects, or recommendations..."
          />
          <Button 
            onClick={handleAskBud} 
            disabled={!question.trim() || isSubmitting}
            className={`absolute bottom-3 right-3 ${
              !question.trim() || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'
            } text-white transition-all`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </span>
            ) : (
              <span className="flex items-center">
                <span>Ask Bud</span>
                <Zap className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Quick Action Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("How do terpenes work?")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <Palette className="h-3 w-3 text-purple-600" />
              <span>How do terpenes work?</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("Explain THC vs CBD")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <FlaskConical className="h-3 w-3 text-purple-600" />
              <span>THC vs CBD</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("Help me recommend for anxiety")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <Leaf className="h-3 w-3 text-purple-600" />
              <span>Anxiety relief</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("What's our most popular indica?")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <Package className="h-3 w-3 text-purple-600" />
              <span>Popular indica</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("What's good for sleep?")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <Bot className="h-3 w-3 text-purple-600" />
              <span>Sleep aid</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick("Show me energizing strains")}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center space-x-1"
            >
              <Zap className="h-3 w-3 text-purple-600" />
              <span>Energy boost</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => {}} // No-op for staff mode
          showEditButton={false}
        />
      )}
    </div>
  );
};

const StaffView = () => {
  const { activeMode, addNotification } = useStaffModeStore();
  const { organizationId, isAuthenticated, dispensaryName } =
    useSimpleAuthStore();
  const { fetchProducts, isLoading, error, productsWithVariants } =
    useProductsStore();

  // Debug authentication state
  useEffect(() => {
    console.log("🔍 StaffView - Auth state:", {
      isAuthenticated,
      organizationId,
      dispensaryName,
      productsCount: productsWithVariants.length,
    });
  }, [
    isAuthenticated,
    organizationId,
    dispensaryName,
    productsWithVariants.length,
  ]);

  // Ensure products are loaded when authentication is ready
  useEffect(() => {
    if (isAuthenticated && organizationId) {
      console.log(
        "✅ StaffView - Auth ready, fetching products for org:",
        organizationId,
      );
      fetchProducts();
    } else if (isAuthenticated && !organizationId) {
      console.error("❌ StaffView - Authenticated but no organizationId found");
      addNotification({
        type: "error",
        message: "Organization not found. Please try logging in again.",
      });
    }
  }, [isAuthenticated, organizationId, fetchProducts, addNotification]);

  // Add a welcome notification when component mounts
  useEffect(() => {
    addNotification({
      type: "info",
      message:
        "Welcome to the enhanced staff workstation! Explore the new modes to boost your productivity.",
    });
  }, [addNotification]);

  // Show loading state if authentication or products are loading
  if (!isAuthenticated || !organizationId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff workspace...</p>
        </div>
      </div>
    );
  }

  const renderActiveMode = () => {
    switch (activeMode) {
      case "search":
        return <ProductSearchMode />;
      case "terpenes":
        return <TerpeneExplorerMode />;
      case "assistant":
        return <BudAIBudtenderMode productsWithVariants={productsWithVariants} />;
      case "inventory":
        return <StaffInventoryMode />;
      case "consultation":
        return <PlaceholderMode mode="Customer Consultation Hub" />;
      case "training":
        return <PlaceholderMode mode="Training & Knowledge Hub" />;
      case "analytics":
        return <PlaceholderMode mode="Performance Analytics" />;
      default:
        return <ProductSearchMode />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <StaffHeader />

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
            <strong>Debug:</strong> Org: {organizationId} | Products:{" "}
            {productsWithVariants.length} | Loading: {isLoading ? "Yes" : "No"}
            {error && <span className="text-red-600"> | Error: {error}</span>}
          </div>
        )}

        {/* Mode Selector */}
        <div className="mb-6">
          <StaffModeSelector />
        </div>

        {/* Active Mode Content */}
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="relative"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full opacity-50 blur-xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-100 rounded-full opacity-40 blur-xl -z-10"></div>
          
          {renderActiveMode()}
        </motion.div>
      </main>
      
      {/* Footer with version info */}
      <footer className="py-3 px-6 text-center text-xs text-gray-500">
        <p>LeafIQ Staff Workstation • Version 2.5.0</p>
      </footer>
    </div>
  );
};

export default StaffView;