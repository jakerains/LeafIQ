import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

const LoadingSpinner = ({ size = 'md', color = 'primary' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };
  
  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    white: 'border-gray-200 border-t-white'
  };
  
  return (
    <motion.div 
      className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};

export default LoadingSpinner;