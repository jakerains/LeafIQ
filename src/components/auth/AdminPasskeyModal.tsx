import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminPasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPasskey?: string;
}

const AdminPasskeyModal: React.FC<AdminPasskeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  correctPasskey = '1234' // Default passkey is 1234
}) => {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when the modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Short delay to ensure modal is visible first
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPasskey('');
      setError('');
      setIsLoading(false);
      setShowPasskey(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      if (passkey === correctPasskey) {
        onSuccess();
        onClose();
      } else {
        setError('Invalid passkey. Please try again.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
      setIsLoading(false);
    }, 400);
  };

  const handleKeyPress = (key: string) => {
    if (passkey.length < 10) { // Limit passkey length
      setPasskey(current => current + key);
    }
  };

  const handleBackspace = () => {
    setPasskey(current => current.slice(0, -1));
  };

  // Enhanced input change handler - filter to only allow numbers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric characters and limit length
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPasskey(numericValue);
    
    // Clear any existing error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Enhanced keyboard event handler for the input field
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation keys, backspace, delete, etc.
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'];
    
    // Allow Enter to submit
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
      return;
    }
    
    // Allow allowed keys and numeric keys
    if (allowedKeys.includes(e.key) || (e.key >= '0' && e.key <= '9')) {
      return; // Let the event through
    }
    
    // Block all other keys
    e.preventDefault();
  };

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle escape key press on modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Re-focus input if it loses focus (unless user is interacting with buttons)
  const handleInputBlur = () => {
    // Only refocus if the focus is moving to something outside the modal
    setTimeout(() => {
      if (isOpen && inputRef.current && !document.activeElement?.closest('.modal-content')) {
        inputRef.current.focus();
      }
    }, 10);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] overflow-y-auto"
          onClick={handleBackdropClick}
          onKeyDown={handleModalKeyDown}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white rounded-2xl p-6 w-full max-w-md relative modal-content my-8 max-h-[calc(100vh-4rem)] overflow-y-auto ${isShaking ? 'animate-shake' : ''}`}
              onClick={e => e.stopPropagation()} // Prevent clicks from propagating
            >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">Admin Access</h2>
            <p className="text-gray-600 text-center mb-6">Enter the admin passkey to continue</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Passkey
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="passkey"
                    type={showPasskey ? "text" : "password"}
                    value={passkey}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••"
                    maxLength={10}
                    autoComplete="off"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPasskey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center mt-2 text-red-600"
                  >
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </div>
              
              {/* Numeric keypad */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num.toString())}
                    tabIndex={-1}
                    className={`${
                      num === 0 ? 'col-start-2' : ''
                    } p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 font-semibold text-xl transition-colors`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleBackspace}
                  tabIndex={-1}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 font-semibold text-xl transition-colors"
                >
                  ⌫
                </button>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  tabIndex={1}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!passkey || isLoading}
                  isLoading={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  tabIndex={2}
                >
                  {isLoading ? 'Verifying...' : 'Access Admin'}
                </Button>
              </div>
              
              {/* Demo passkey hint */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Demo passkey:</span> 1234
                </p>
              </div>
            </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
    document.body
  );
};

export default AdminPasskeyModal;