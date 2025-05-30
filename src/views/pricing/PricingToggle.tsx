import { motion } from 'framer-motion';

interface PricingToggleProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

export const PricingToggle = ({ isYearly, setIsYearly }: PricingToggleProps) => {
  return (
    <motion.div 
      className="flex justify-center items-center mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <span className={`mr-3 font-medium ${!isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Monthly</span>
      <div 
        className="relative w-16 h-8 bg-gray-200 rounded-full cursor-pointer shadow-inner"
        onClick={() => setIsYearly(!isYearly)}
      >
        <motion.div 
          className="absolute w-6 h-6 bg-primary-500 rounded-full top-1 shadow-md"
          animate={{ x: isYearly ? 34 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <span className={`ml-3 font-medium ${isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Yearly</span>
      {isYearly && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-medium"
        >
          Save 17% (2 months free!)
        </motion.div>
      )}
    </motion.div>
  );
};