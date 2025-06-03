import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Package, Leaf, Zap, FlaskConical, Tag, DollarSign, Palette, Info, TrendingUp } from 'lucide-react';
import { ProductWithVariant } from '../../../types';
import { useProductsStore } from '../../../stores/productsStore';

interface ProductDetailsModalProps {
  product: ProductWithVariant;
  onClose: () => void;
  onEdit: (product: ProductWithVariant) => void;
  showEditButton?: boolean;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onEdit, showEditButton = true }) => {
  const { variants } = useProductsStore();
  
  // Get all variants for this product
  const productVariants = variants.filter(v => v.product_id === product.id);
  
  // Calculate inventory stats
  const totalInventory = productVariants.reduce((sum, v) => sum + v.inventory_level, 0);
  const averagePrice = productVariants.length > 0 
    ? productVariants.reduce((sum, v) => sum + (v.price || 0), 0) / productVariants.length 
    : 0;
  
  // Get terpene profile (from first variant with terpenes)
  const terpeneProfile = productVariants.find(v => v.terpene_profile && Object.keys(v.terpene_profile).length > 0)?.terpene_profile || {};
  const topTerpenes = Object.entries(terpeneProfile)
    .sort(([,a], [,b]) => (b || 0) - (a || 0))
    .slice(0, 5);

  // Inventory status
  const inventoryStatus = totalInventory > 50 ? 'high' : totalInventory > 20 ? 'medium' : totalInventory > 0 ? 'low' : 'out';
  const inventoryColor = {
    high: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-orange-600 bg-orange-100',
    out: 'text-red-600 bg-red-100'
  }[inventoryStatus];

  const strainTypeColor = {
    sativa: 'text-green-700 bg-green-100 border-green-200',
    indica: 'text-purple-700 bg-purple-100 border-purple-200',
    hybrid: 'text-blue-700 bg-blue-100 border-blue-200',
    cbd: 'text-teal-700 bg-teal-100 border-teal-200',
    balanced: 'text-indigo-700 bg-indigo-100 border-indigo-200'
  }[product.strain_type || 'hybrid'];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{ alignItems: 'safe center' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg bg-white bg-opacity-20 mx-auto sm:mx-0">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-primary-100 text-base sm:text-lg mb-3">{product.brand}</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Description */}
              {product.description && (
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center mb-3">
                    <Info className="text-primary-600 mr-2\" size={20} />
                    <h3 className="text-lg font-semibold">Description</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Cannabinoid Profile */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center mb-4">
                  <Leaf className="text-green-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold">Cannabinoid Profile</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {product.variant.thc_percentage ? product.variant.thc_percentage.toFixed(1) : '0.0'}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">THC</div>
                  </div>
                   
                  {product.variant.cbd_percentage !== null && product.variant.cbd_percentage !== undefined && product.variant.cbd_percentage > 0 && (
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {product.variant.cbd_percentage?.toFixed(1)}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">CBD</div>
                    </div>
                  )}
                   
                  {product.variant.total_cannabinoids !== null && product.variant.total_cannabinoids !== undefined && product.variant.total_cannabinoids > 0 && (
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {product.variant.total_cannabinoids?.toFixed(1)}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Total</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Terpene Profile */}
              {topTerpenes.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center mb-4">
                    <Palette className="text-purple-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">Terpene Profile</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {topTerpenes.map(([terpene, percentage]) => (
                      <div key={terpene} className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium capitalize">
                          {terpene.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                              style={{ width: `${Math.min(((percentage || 0) / Math.max(...Object.values(terpeneProfile).filter(v => typeof v === 'number'))) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 min-w-[3rem] text-right">
                            {(percentage || 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {productVariants.length > 1 && (
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center mb-4">
                    <Package className="text-gray-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">Available Sizes</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productVariants.map((variant) => (
                      <div key={variant.id} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{variant.size_weight}</div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              Stock: {variant.inventory_level} units
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-bold text-primary-600">
                              ${variant.price ? variant.price.toFixed(2) : '0.00'}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              variant.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {variant.is_available ? 'Available' : 'Unavailable'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              
              {/* Inventory Status */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center mb-3">
                  <TrendingUp className="text-gray-600 mr-2" size={20} />
                  <h3 className="font-semibold">Inventory Status</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Total Stock</span>
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${inventoryColor}`}>
                      {totalInventory} units
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Variants</span>
                    <span className="font-medium text-xs sm:text-sm">{productVariants.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Avg. Price</span>
                    <span className="font-medium text-xs sm:text-sm">${averagePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center mb-3">
                  <Zap className="text-blue-600 mr-2" size={20} />
                  <h3 className="font-semibold">Quick Stats</h3>
                </div>
                
                <div className="space-y-2 text-xs sm:text-sm">
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
                      <span className="font-medium">{product.genetics}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {showEditButton && (
                  <button
                    onClick={() => onEdit(product)}
                    className="w-full bg-primary-600 text-white py-2 sm:py-3 px-4 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                  >
                    Edit Product
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-2 sm:py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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

export default ProductDetailsModal;