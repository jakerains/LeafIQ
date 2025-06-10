interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  };
  
  return (
    <img 
      src="/leafiq-logo.png" 
      alt="LeafIQ" 
      className={`${sizeClasses[size]} drop-shadow-lg filter shadow-primary-500/50 ${className}`}
    />
  );
};

export default Logo;