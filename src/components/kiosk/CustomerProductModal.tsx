import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, Palette, Info, Star, Clock, Lightbulb, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductWithVariant } from '../../types';
import { useProductsStore } from '../../stores/productsStore';

interface CustomerProductModalProps {
  product: ProductWithVariant;
  onClose: () => void;
  effects?: string[];
}

const CustomerProductModal: React.FC<CustomerProductModalProps> = ({ product, onClose, effects = [] }) => {
  const { variants } = useProductsStore();
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);
  const [isEffectsExpanded, setIsEffectsExpanded] = useState(false);
  const [isCannabinoidExpanded, setIsCannabinoidExpanded] = useState(false);
  const [isTerpeneExpanded, setIsTerpeneExpanded] = useState(false);
  
  // Get all variants for this product
  const productVariants = variants.filter(v => v.product_id === product.id);
  
  // Get terpene profile (from first variant with terpenes)
  const terpeneProfile = productVariants.find(v => v.terpene_profile && Object.keys(v.terpene_profile).length > 0)?.terpene_profile || {};
  const topTerpenes = Object.entries(terpeneProfile)
    .sort(([,a], [,b]) => (b || 0) - (a || 0))
    .slice(0, 5);

  const strainTypeColor = {
    sativa: 'text-green-700 bg-green-100 border-green-200',
    indica: 'text-purple-700 bg-purple-100 border-purple-200',
    hybrid: 'text-blue-700 bg-blue-100 border-blue-200',
    cbd: 'text-teal-700 bg-teal-100 border-teal-200',
    balanced: 'text-indigo-700 bg-indigo-100 border-indigo-200'
  }[product.strain_type || 'hybrid'];

  // Strain type effects descriptions
  const strainEffects = {
    sativa: ['Energizing', 'Creative', 'Uplifting', 'Focus'],
    indica: ['Relaxing', 'Calming', 'Sleep Aid', 'Body High'],
    hybrid: ['Balanced', 'Versatile', 'Mood Boost', 'Well-Rounded'],
    cbd: ['Therapeutic', 'Non-Psychoactive', 'Anti-Inflammatory', 'Wellness'],
    balanced: ['Mild', 'Gentle', 'Even Effects', 'Beginner-Friendly']
  }[product.strain_type || 'hybrid'];

  // Terpene effects guide
  const terpeneEffects = {
    myrcene: 'Relaxing, sedating, muscle relaxant',
    limonene: 'Mood elevation, stress relief, focus',
    pinene: 'Alertness, memory retention, anti-inflammatory',
    linalool: 'Calming, anti-anxiety, sleep aid',
    caryophyllene: 'Pain relief, anti-inflammatory, stress reduction',
    terpinolene: 'Uplifting, creative, antioxidant',
    humulene: 'Appetite suppressant, anti-inflammatory',
    bisabolol: 'Anti-irritant, calming, skin healing'
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg bg-white bg-opacity-20">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Product info */}
              <div>
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <p className="text-emerald-100 text-lg mb-3">{product.brand}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${strainTypeColor}`}>
                    {(product.strain_type || 'hybrid').charAt(0).toUpperCase() + (product.strain_type || 'hybrid').slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                  {product.subcategory && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-15 text-white">
                      {product.subcategory}
                    </span>
                  )}
                </div>
                
                {/* Price display */}
                <div className="bg-white bg-opacity-20 rounded-2xl p-3 inline-block">
                  <div className="text-2xl font-bold">
                    ${product.variant.price ? Number(product.variant.price).toFixed(2) : '0.00'}
                  </div>
                  {product.variant.size_weight && (
                    <div className="text-emerald-100 text-sm">
                      per {product.variant.size_weight}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Description */}
              {product.description && (
                <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                  <div className="flex items-center mb-3">
                    <Info className="text-emerald-100 mr-2" size={18} />
                    <h3 className="text-lg font-semibold text-white">About This Product</h3>
                  </div>
                  <p className="text-emerald-100 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category-Specific Tips */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5">
                <button
                  onClick={() => setIsTipsExpanded(!isTipsExpanded)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-white hover:bg-opacity-30 rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <Lightbulb className="text-amber-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)} Tips & Guide
                    </h3>
                  </div>
                  {isTipsExpanded ? (
                    <ChevronUp className="text-amber-600" size={20} />
                  ) : (
                    <ChevronDown className="text-amber-600" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {isTipsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {/* Category-specific content */}
                      {product.category === 'flower' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🌿 How to Use</h4>
                      <p className="text-sm text-gray-700">
                        Grind flower finely for even burning. Use a pipe, bong, or roll into joints. 
                        Start with 1-2 small puffs and wait 5-10 minutes to feel effects.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">⏱️ Timing</h4>
                      <p className="text-sm text-gray-700">
                        Effects typically begin within 1-5 minutes and peak around 30 minutes. 
                        Duration is usually 1-3 hours depending on potency and tolerance.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">💡 Pro Tips</h4>
                      <p className="text-sm text-gray-700">
                        Store in airtight containers to preserve freshness. Break apart by hand or use a grinder. 
                        {product.strain_type === 'indica' ? ' Best for evening use.' : 
                         product.strain_type === 'sativa' ? ' Great for daytime activities.' : 
                         ' Versatile for any time of day.'}
                      </p>
                    </div>
                  </div>
                )}

                {product.category === 'concentrate' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🔥 Consumption Methods</h4>
                      <p className="text-sm text-gray-700">
                        Use a dab rig, e-nail, or concentrate vaporizer. Start with a rice grain-sized amount. 
                        Optimal temperature is 315-400°F for best flavor and effects.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">⚠️ Potency Warning</h4>
                      <p className="text-sm text-gray-700">
                        Concentrates are much stronger than flower (often 60-90% THC). 
                        Effects are nearly immediate and very potent. Less is more!
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🛠️ Tools Needed</h4>
                      <p className="text-sm text-gray-700">
                        Dabber tool, carb cap, torch (for traditional rigs), or electric nail. 
                        Store in cool, dark place. Avoid touching with fingers.
                      </p>
                    </div>
                  </div>
                )}

                {product.category === 'edible' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🍽️ Dosing Guide</h4>
                      <p className="text-sm text-gray-700">
                        Start with 2.5-5mg THC. Wait 2 hours before taking more. 
                        Effects can take 30 minutes to 2 hours to begin, lasting 4-8 hours.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🕐 Important Timing</h4>
                      <p className="text-sm text-gray-700">
                        Edibles process through your liver, creating stronger, longer-lasting effects. 
                        Don't redose for at least 2 hours - patience is key!
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🥘 Food Factors</h4>
                      <p className="text-sm text-gray-700">
                        Take on empty stomach for faster onset, with fatty foods for stronger effects. 
                        Store in cool, dry place away from children and pets.
                      </p>
                    </div>
                  </div>
                )}

                {product.category === 'vaporizer' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">💨 How to Use</h4>
                      <p className="text-sm text-gray-700">
                        Attach cartridge to compatible 510-thread battery. Start with 1-2 second draws. 
                        Allow 5-10 minutes between uses to gauge effects.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🔋 Battery Settings</h4>
                      <p className="text-sm text-gray-700">
                        Use lowest voltage setting (2.0-2.4V) for best flavor. Higher settings (3.0V+) 
                        produce more vapor but may burn the oil and taste harsh.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🔧 Maintenance</h4>
                      <p className="text-sm text-gray-700">
                        Store upright to prevent leaking. Keep battery charged for consistent performance. 
                        Clean connection points with cotton swab if needed.
                      </p>
                    </div>
                  </div>
                )}

                {product.category === 'topical' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🧴 Application</h4>
                      <p className="text-sm text-gray-700">
                        Apply small amount to clean skin. Massage gently into affected area. 
                        Can be reapplied as needed - topicals don't cause psychoactive effects.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🎯 Target Areas</h4>
                      <p className="text-sm text-gray-700">
                        Great for localized pain, inflammation, or skin conditions. 
                        Effects are limited to application area and typically last 2-4 hours.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">✨ Benefits</h4>
                      <p className="text-sm text-gray-700">
                        Non-psychoactive, won't show up on drug tests, safe for daily use. 
                        Ideal for athletes, seniors, or those wanting targeted relief.
                      </p>
                    </div>
                  </div>
                )}

                {product.category === 'tincture' && (
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">💧 Sublingual Method</h4>
                      <p className="text-sm text-gray-700">
                        Place drops under tongue, hold for 60-90 seconds before swallowing. 
                        This allows faster absorption through mucous membranes.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">📏 Precise Dosing</h4>
                      <p className="text-sm text-gray-700">
                        Start with 0.25-0.5ml (about 1/4 dropper). Effects begin in 15-45 minutes, 
                        peak at 1-2 hours, and last 4-6 hours.
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">🥤 Mixing Options</h4>
                      <p className="text-sm text-gray-700">
                        Can be mixed into drinks or food, but onset will be slower (like edibles). 
                        Store in cool, dark place. Shake well before each use.
                      </p>
                    </div>
                  </div>
                )}

                      {/* Fallback for other categories */}
                      {!['flower', 'concentrate', 'edible', 'vaporizer', 'topical', 'tincture'].includes(product.category) && (
                        <div className="bg-white bg-opacity-60 rounded-xl p-4">
                          <h4 className="font-medium text-amber-800 mb-2">📋 General Guidelines</h4>
                          <p className="text-sm text-gray-700">
                            Always start with the lowest recommended dose and wait for effects before taking more. 
                            Consult with our staff for specific usage instructions and recommendations.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Effects & Experience */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5">
                <button
                  onClick={() => setIsEffectsExpanded(!isEffectsExpanded)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-white hover:bg-opacity-30 rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <Star className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">What to Expect</h3>
                  </div>
                  {isEffectsExpanded ? (
                    <ChevronUp className="text-blue-600" size={20} />
                  ) : (
                    <ChevronDown className="text-blue-600" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {isEffectsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {/* AI-provided effects */}
                      {effects.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">AI-Recommended Effects:</p>
                          <div className="flex flex-wrap gap-2">
                            {effects.map((effect, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Strain type effects */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Typical {(product.strain_type || 'hybrid').charAt(0).toUpperCase() + (product.strain_type || 'hybrid').slice(1)} Effects:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {strainEffects.map((effect, i) => (
                            <span key={i} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cannabinoid Profile */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5">
                <button
                  onClick={() => setIsCannabinoidExpanded(!isCannabinoidExpanded)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-white hover:bg-opacity-30 rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center">
                    <Leaf className="text-green-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">Cannabinoid Profile</h3>
                  </div>
                  {isCannabinoidExpanded ? (
                    <ChevronUp className="text-green-600" size={20} />
                  ) : (
                    <ChevronDown className="text-green-600" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {isCannabinoidExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {product.variant.thc_percentage ? product.variant.thc_percentage.toFixed(1) : '0.0'}%
                          </div>
                          <div className="text-sm text-gray-600">THC</div>
                          <div className="text-xs text-gray-500 mt-1">Psychoactive</div>
                        </div>
                        
                        {product.variant.cbd_percentage !== null && product.variant.cbd_percentage !== undefined && (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                              {product.variant.cbd_percentage?.toFixed(1) || '0.0'}%
                            </div>
                            <div className="text-sm text-gray-600">CBD</div>
                            <div className="text-xs text-gray-500 mt-1">Non-psychoactive</div>
                          </div>
                        )}
                        
                        {product.variant.total_cannabinoids !== null && product.variant.total_cannabinoids !== undefined && product.variant.total_cannabinoids > 0 && (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                              {product.variant.total_cannabinoids?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Total</div>
                            <div className="text-xs text-gray-500 mt-1">All cannabinoids</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Beginner guidance */}
                      <div className="bg-white bg-opacity-60 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <Lightbulb className="text-amber-500 mr-2" size={16} />
                          <span className="text-sm font-medium">New to Cannabis?</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {product.variant.thc_percentage && product.variant.thc_percentage > 20 
                            ? "This is a high-potency product. Start with a very small amount and wait 15-30 minutes before consuming more."
                            : product.variant.thc_percentage && product.variant.thc_percentage > 15 
                              ? "This is a medium-potency product. Start low and go slow."
                              : "This is a good option for beginners. Start with a small amount and see how you feel."
                          }
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Terpene Profile */}
              {topTerpenes.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5">
                  <button
                    onClick={() => setIsTerpeneExpanded(!isTerpeneExpanded)}
                    className="w-full flex items-center justify-between mb-4 hover:bg-white hover:bg-opacity-30 rounded-xl p-3 transition-colors"
                  >
                    <div className="flex items-center">
                      <Palette className="text-purple-600 mr-2" size={20} />
                      <h3 className="text-lg font-semibold">Terpene Profile</h3>
                    </div>
                    {isTerpeneExpanded ? (
                      <ChevronUp className="text-purple-600" size={20} />
                    ) : (
                      <ChevronDown className="text-purple-600" size={20} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isTerpeneExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4">
                          {topTerpenes.map(([terpene, percentage]) => (
                            <div key={terpene} className="bg-white bg-opacity-60 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium capitalize">
                                  {terpene.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {(percentage || 0).toFixed(2)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(((percentage || 0) / Math.max(...Object.values(terpeneProfile).filter(v => typeof v === 'number'))) * 100, 100)}%` }}
                                />
                              </div>
                              {terpeneEffects[terpene as keyof typeof terpeneEffects] && (
                                <p className="text-xs text-gray-600">
                                  {terpeneEffects[terpene as keyof typeof terpeneEffects]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              
              {/* Available Sizes */}
              {productVariants.length > 1 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Clock className="text-gray-600 mr-2" size={20} />
                    <h3 className="font-semibold">Available Options</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {productVariants.filter(v => v.is_available && v.inventory_level > 0).map((variant) => (
                      <div key={variant.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{variant.size_weight}</div>
                            <div className="text-sm text-green-600">
                              In Stock
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">
                              ${variant.price ? variant.price.toFixed(2) : '0.00'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Facts */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5">
                <div className="flex items-center mb-3">
                  <Info className="text-amber-600 mr-2" size={20} />
                  <h3 className="font-semibold">Quick Facts</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                  
                  {product.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium capitalize">{product.subcategory}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Strain</span>
                    <span className="font-medium capitalize">{product.strain_type || 'Hybrid'}</span>
                  </div>
                  
                  {product.genetics && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Genetics</span>
                      <span className="font-medium text-xs">{product.genetics}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center"
                >
                  <Heart size={18} className="mr-2" />
                  Ask Staff About This Product
                </motion.button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default CustomerProductModal; 