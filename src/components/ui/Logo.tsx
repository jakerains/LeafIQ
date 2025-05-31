import { ReactNode } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white';
  className?: string;
}

const Logo = ({ size = 'md', variant = 'primary', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  const containerSizes = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24'
  };
  
  return (
    <div className={`flex items-center ${containerSizes[size]} px-6 rounded-2xl bg-gradient-to-r from-primary-100 to-accent-50 shadow-xl border border-primary-200 ${className}`}>
      <div className="flex items-center">
        <img 
          src="/leafiq-logo.png" 
          alt="LeafIQ" 
          className={`${containerSizes[size]} drop-shadow-lg filter shadow-primary-500/50`}
        />
      </div>
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