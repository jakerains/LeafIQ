import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const InfoModal = ({ isOpen, onClose, title, children }: InfoModalProps) => {
  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-0 overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            {/* Modal header with gradient background */}
            <div className="py-6 px-8 bg-gradient-to-r from-primary-600 to-primary-400 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Modal content */}
            <div className="p-8">
              {children}
            </div>
            
            {/* Modal footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 transition-colors rounded-xl font-medium text-gray-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;