import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { ProductWithVariant } from '../../types';
import { vibesToTerpenes } from '../../data/demoData';
import { Sparkles } from 'lucide-react';
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