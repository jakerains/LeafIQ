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
      className={twMerge("overflow-hidden", className)}
      onClick={() => onProductSelect && onProductSelect(product)}
    >
      <div className="aspect-square overflow-hidden rounded-2xl mb-4">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.brand}</p>
        </div>
        <div className="bg-white rounded-full py-1 px-3 shadow-sm">
          <p className="font-semibold text-accent-600">${variant.price ? Number(variant.price).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 my-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.strain_type === 'sativa' ? 'bg-green-100 text-green-800' : product.strain_type === 'indica' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
          {product.strain_type.charAt(0).toUpperCase() + product.strain_type.slice(1)}
        </span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        {effects.map((effect, i) => (
          <span key={i} className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
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
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(variant.terpene_profile).map(([terpene, value]) => (
              value && value > 0 ? (
                <span key={terpene} className="text-xs">
                  {terpene.charAt(0).toUpperCase() + terpene.slice(1)}: {value.toFixed(1)}%
                </span>
              ) : null
            ))}
          </div>
        </div>
      )}

      <div className="flex mt-4 gap-2">
        <motion.button
          className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Info size={16} /> Product Details
        </motion.button>
        {showInventory && (
          <>
            <motion.button
              className="p-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={18} />
            </motion.button>
            <motion.button
              className="p-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
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