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
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="text-center p-4">
          <motion.div variants={item}>
            <ShimmerButton
              className="mb-3 mx-auto"
              shimmerColor="#22c55e"
              background="rgba(34, 197, 94, 0.1)"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Target size={24} className="text-primary-600" />
              </div>
            </ShimmerButton>
            <h3 className="text-lg font-semibold mb-1">Personalized Matches</h3>
            <p className="text-gray-600 text-sm">Find products perfectly suited to your experience.</p>
          </motion.div>
        </GlassCard>
        
        <GlassCard className="text-center p-4">
          <motion.div variants={item}>
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                <Package size={24} className="text-secondary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">In-Stock Guarantee</h3>
            <p className="text-gray-600 text-sm">All recommendations available right now in store.</p>
          </motion.div>
        </GlassCard>
        
        <GlassCard className="text-center p-4">
          <motion.div variants={item}>
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                <Brain size={24} className="text-accent-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1">Expert Guidance</h3>
            <p className="text-gray-600 text-sm">Our staff provides insights on any recommendation.</p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default KioskHome;