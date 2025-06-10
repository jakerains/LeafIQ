'use client';
import { ArrowRight, Loader2 } from 'lucide-react';

interface FlowButtonProps {
  text?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function FlowButton({ 
  text = "Modern Button", 
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  leftIcon,
  rightIcon = <ArrowRight className="w-4 h-4" />
}: FlowButtonProps) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#22c55e',
        color: '#22c55e',
        borderWidth: '1.5px',
        borderStyle: 'solid'
      }}
      className={`group relative flex items-center gap-1 overflow-hidden rounded-[100px] px-8 py-3 text-lg font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95] disabled:cursor-not-allowed min-w-[140px] ${className}`}
    >
      {/* Left icon */}
      {leftIcon && (
        <span className="absolute w-4 h-4 left-[-25%] z-[9] group-hover:left-4 group-hover:text-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          {leftIcon}
        </span>
      )}

      {/* Text */}
      <span className={`relative z-[1] transition-all duration-[800ms] ease-out ${leftIcon ? '-translate-x-3 group-hover:translate-x-3' : ''} ${rightIcon ? 'translate-x-0 group-hover:-translate-x-2' : ''} group-hover:!text-white`}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Searching...
          </span>
        ) : (
          text
        )}
      </span>

      {/* Circle background */}
      <span 
        style={{ backgroundColor: '#22c55e' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-[50%] group-hover:w-[220px] group-hover:h-[220px] transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
      ></span>

      {/* Right icon */}
      {rightIcon && (
        <span 
          style={{ color: '#22c55e' }}
          className="absolute w-4 h-4 right-4 z-[9] group-hover:right-[-25%] group-hover:text-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
}