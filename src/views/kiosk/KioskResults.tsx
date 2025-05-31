import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { Button } from '../../components/ui/button';
import { ProductWithVariant } from '../../types';
import { vibesToTerpenes } from '../../data/demoData';
import { Sparkles } from 'lucide-react';

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
      </motion.div>

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

      <motion.div
        variants={item}
        className="text-center mt-12 p-6 bg-primary-50 rounded-3xl"
      >
        <h3 className="text-2xl font-semibold mb-3">Need more guidance?</h3>
        <p className="text-gray-700 mb-4">
          Our knowledgeable staff can provide additional details about these products and help you make the perfect choice.
        </p>
        <div className="inline-flex p-3 bg-white rounded-xl shadow-sm">
          <p className="text-primary-700 font-medium">Just ask for assistance!</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KioskResults;