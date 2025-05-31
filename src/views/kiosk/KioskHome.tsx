import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { Target, Package, Brain } from 'lucide-react';
import { VercelV0Chat } from '../../components/ui/v0-ai-chat';
import { ShimmerButton } from '../../components/ui/shimmer-button';

interface KioskHomeProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const KioskHome = ({ onSearch, isLoading }: KioskHomeProps) => {
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

  return (
    <motion.div 
      className="max-w-4xl mx-auto text-center flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* V0 Chat Component */}
      <VercelV0Chat onSearch={onSearch} isLoading={isLoading} />
      
      <motion.div 
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
      >
        {/* Personalized Matches Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl"
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/3-yep.jpg" 
              alt="" 
              className="w-full h-full object-cover opacity-20 brightness-[0.8] saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-800/70 mix-blend-multiply" />
          </div>
          
          {/* Card content */}
          <div className="relative z-10 p-6 flex flex-col items-center text-white h-full">
            <div className="bg-primary-400/30 backdrop-blur-md p-4 rounded-full mb-4">
              <Target className="h-8 w-8 text-primary-50" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Personalized Matches</h3>
            
            <p className="text-primary-100 mb-4">
              Find products perfectly suited to your experience, based on your unique preferences and desired effects.
            </p>
            
            <div className="mt-auto">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* In-Stock Guarantee Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl" 
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/3-yep.jpg" 
              alt="" 
              className="w-full h-full object-cover opacity-20 brightness-[0.8] saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 to-secondary-800/70 mix-blend-multiply" />
          </div>
          
          {/* Card content */}
          <div className="relative z-10 p-6 flex flex-col items-center text-white h-full">
            <div className="bg-secondary-400/30 backdrop-blur-md p-4 rounded-full mb-4">
              <Package className="h-8 w-8 text-secondary-50" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">In-Stock Guarantee</h3>
            
            <p className="text-secondary-100 mb-4">
              All recommendations available right now in store, with real-time inventory tracking to ensure availability.
            </p>
            
            <div className="mt-auto">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Expert Guidance Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl" 
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/3-yep.jpg" 
              alt="" 
              className="w-full h-full object-cover opacity-20 brightness-[0.8] saturate-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent-900/90 to-accent-800/70 mix-blend-multiply" />
          </div>
          
          {/* Card content */}
          <div className="relative z-10 p-6 flex flex-col items-center text-white h-full">
            <div className="bg-accent-400/30 backdrop-blur-md p-4 rounded-full mb-4">
              <Brain className="h-8 w-8 text-accent-50" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
            
            <p className="text-accent-100 mb-4">
              Our knowledgeable staff provides personalized insights on any recommendation, helping you make informed choices.
            </p>
            
            <div className="mt-auto">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default KioskHome;