import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { ProductWithVariant } from '../../../types';

interface ProductFormProps {
  product: ProductWithVariant | null;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const ProductForm = ({ product, onClose, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    category: 'flower',
    description: '',
    image_url: '',
    thc_percentage: 0,
    cbd_percentage: 0,
    price: 0,
    strain_type: 'hybrid',
    terpene_profile: {
      myrcene: 0,
      limonene: 0,
      pinene: 0,
      caryophyllene: 0,
      linalool: 0
    },
    inventory_level: 0
  });

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description,
        image_url: product.image_url,
        thc_percentage: product.thc_percentage,
        cbd_percentage: product.cbd_percentage,
        price: product.price,
        strain_type: product.variant.strain_type,
        terpene_profile: { ...product.variant.terpene_profile },
        inventory_level: product.variant.inventory_level
      });
    } else {
      // Generate a new ID for new products
      setFormData(prev => ({
        ...prev,
        id: `p${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      }));
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTerpeneChange = (terpene: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      terpene_profile: {
        ...prev.terpene_profile,
        [terpene]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
            
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                Product ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                disabled
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand*
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="flower">Flower</option>
                <option value="edible">Edible</option>
                <option value="concentrate">Concentrate</option>
                <option value="vaporizer">Vaporizer</option>
                <option value="tincture">Tincture</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="strain_type" className="block text-sm font-medium text-gray-700 mb-1">
                Strain Type*
              </label>
              <select
                id="strain_type"
                name="strain_type"
                value={formData.strain_type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="sativa">Sativa</option>
                <option value="indica">Indica</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Product Details</h3>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL*
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="thc_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                  THC %*
                </label>
                <input
                  type="number"
                  id="thc_percentage"
                  name="thc_percentage"
                  value={formData.thc_percentage}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cbd_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                  CBD %
                </label>
                <input
                  type="number"
                  id="cbd_percentage"
                  name="cbd_percentage"
                  value={formData.cbd_percentage}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD)*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="inventory_level" className="block text-sm font-medium text-gray-700 mb-1">
                  Inventory Level*
                </label>
                <input
                  type="number"
                  id="inventory_level"
                  name="inventory_level"
                  value={formData.inventory_level}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Terpene Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Terpene Profile</h3>
            
            <div className="space-y-3">
              {Object.entries(formData.terpene_profile).map(([terpene, value]) => (
                <div key={terpene}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      {terpene.charAt(0).toUpperCase() + terpene.slice(1)}
                    </label>
                    <span className="text-sm">{value.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => handleTerpeneChange(terpene, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  const newTerpene = prompt('Enter new terpene name:');
                  if (newTerpene && !formData.terpene_profile[newTerpene]) {
                    setFormData(prev => ({
                      ...prev,
                      terpene_profile: {
                        ...prev.terpene_profile,
                        [newTerpene]: 0.0
                      }
                    }));
                  }
                }}
                className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Terpene
              </button>
            </div>
            
            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={formData.image_url} 
                    alt="Product preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Error'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-8 space-x-3">
          <Button 
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftIcon={<Save size={16} />}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;