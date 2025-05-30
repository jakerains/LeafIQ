import { ReactNode } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white';
}

const Logo = ({ size = 'md', variant = 'primary' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64
  };
  
  return (
    <div className="flex items-center py-3 px-6 rounded-2xl bg-gradient-to-r from-primary-100 to-accent-50 shadow-xl border border-primary-200">
      <img 
        src="/pjmry.png" 
        alt="LeafIQ Logo" 
        className={`mr-3 h-${iconSizes[size] === 32 ? '8' : iconSizes[size] === 48 ? '12' : '16'}`} 
      />
      <div className="font-display font-bold tracking-wide flex items-center">
        <span className={`bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent ${sizeClasses[size]}`}>
          Leaf
        </span>
        <span className={`bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent ${sizeClasses[size]} font-black`}>
          IQ
        </span>
      </div>
    </div>
  );
};

export default Logo;