import { Heart, Info, ShoppingBag } from 'lucide-react';
import { ProductWithVariant } from '../../types';
import GlassCard from './GlassCard';
import { twMerge } from 'tailwind-merge'; 
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ProductWithVariant;
  effects?: string[];
  showTerpenes?: boolean;
  showInventory?: boolean;
  className?: string;
  onProductSelect?: (product: ProductWithVariant) => void;
}

const ProductCard = ({
  product,
  effects = [],
  showTerpenes = false,
  showInventory = false,
  className,
  onProductSelect
}: ProductCardProps) => {
  const { variant } = product;
  const inventoryStatus = variant.inventory_level > 10 
    ? 'high' 
    : variant.inventory_level > 3 
      ? 'medium' 
      : 'low';
  
  const inventoryColorClass = {
    high: 'text-green-500',
    medium: 'text-yellow-500',
    low: 'text-red-500'
  }[inventoryStatus];

  return (
    <GlassCard 
      className={twMerge("overflow-hidden hover:border-primary-200 transition-all duration-300", className)}
      onClick={() => onProductSelect && onProductSelect(product)}
    >
      <div className="aspect-square overflow-hidden rounded-2xl mb-4 border border-gray-100 shadow-inner">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.brand}</p>
        </div>
        <div className="bg-white rounded-full py-1.5 px-3.5 shadow-md border border-gray-100">
          <p className="font-semibold text-accent-600 text-lg">${variant.price ? Number(variant.price).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 my-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
          product.strain_type === 'sativa' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : product.strain_type === 'indica' 
              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {product.strain_type.charAt(0).toUpperCase() + product.strain_type.slice(1)}
        </span>
        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium shadow-sm border border-gray-200">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        {effects.map((effect, i) => (
          <span key={i} className="px-2.5 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium shadow-sm border border-primary-200">
            {effect}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-1 text-sm">
        <div className="flex gap-2">
          <span className="font-medium">THC: {variant.thc_percentage ? Number(variant.thc_percentage).toFixed(1) : '0.0'}%</span>
          {variant.cbd_percentage && variant.cbd_percentage > 0 && (
            <span className="font-medium">CBD: {Number(variant.cbd_percentage).toFixed(1)}%</span>
          )}
        </div>
        {showInventory && (
          <span className={inventoryColorClass}>
            Stock: {variant.inventory_level} units
          </span>
        )}
      </div>

      {showTerpenes && variant.terpene_profile && Object.keys(variant.terpene_profile).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm font-medium mb-1">Terpene Profile:</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {Object.entries(variant.terpene_profile).map(([terpene, value]) => (
              value && value > 0 ? (
                <span key={terpene} className="text-xs px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                  <span className="font-medium">{terpene.charAt(0).toUpperCase() + terpene.slice(1)}:</span> {value.toFixed(1)}%
                </span>
              ) : null
            ))}
          </div>
        </div>
      )}

      <div className="flex mt-4 gap-2">
        <motion.button 
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info size={16} /> Product Details
        </motion.button>
        {showInventory && (
          <>
            <motion.button
              className="p-2.5 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors shadow-md hover:shadow-lg"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={18} />
            </motion.button>
            <motion.button
              className="p-2.5 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors shadow-md hover:shadow-lg"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={18} />
            </motion.button>
          </>
        )}
      </div>
    </GlassCard>
  );
};

export default ProductCard;