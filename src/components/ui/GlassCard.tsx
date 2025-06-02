import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ 
  children, 
  className,
  hoverEffect = true,
  onClick
}: GlassCardProps) => {
  const baseStyles = "glass-card bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl border border-white border-opacity-30 shadow-lg p-6 transition-all duration-300";
  const hoverStyles = hoverEffect ? "hover:shadow-xl hover:translate-y-[-6px]" : "";
  
  return (
    <motion.div 
      className={twMerge(baseStyles, hoverStyles, className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}  
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;