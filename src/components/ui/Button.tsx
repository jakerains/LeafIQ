import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300";
  
  const variantStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-md hover:shadow-lg",
    accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };
  
  const loadingStyles = isLoading ? "opacity-80 cursor-wait" : "";
  const disabledStyles = disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "";
  const fullWidthStyles = isFullWidth ? "w-full" : "";
  
  const buttonStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    loadingStyles,
    disabledStyles,
    fullWidthStyles,
    className
  );

  return (
    <motion.button
      className={buttonStyles}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      
      {children}
      
      {rightIcon && !isLoading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </motion.button>
  );
};

export default Button;