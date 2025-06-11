import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Mail } from 'lucide-react';
import { ShimmerButton } from './shimmer-button';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    // Simulate API call to save email
    try {
      // In a real implementation, this would be an API call to your backend
      // For example: await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Email collected:', email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Error submitting email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
                <h2 className="text-3xl font-bold mb-3">Coming Soon!</h2>
                <p className="opacity-90">
                  LeafIQ is currently in private beta. Join our waitlist to be among the first to experience AI-powered cannabis retail.
                </p>
              </div>

              <div className="p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      We'll notify you when LeafIQ launches. In the meantime, we may reach out with exclusive early access offers.
                    </p>
                    <ShimmerButton
                      onClick={onClose}
                      shimmerColor="#22c55e"
                      background="rgba(34, 197, 94, 1)"
                    >
                      Close
                    </ShimmerButton>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-6">Join the Waitlist</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                      </div>
                      
                      <ShimmerButton
                        className="w-full"
                        shimmerColor="#22c55e"
                        background="rgba(34, 197, 94, 1)"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          <>
                            <Send size={18} className="mr-2" />
                            Notify Me
                          </>
                        )}
                      </ShimmerButton>
                    </form>
                    
                    <p className="text-gray-500 text-sm mt-6">
                      By joining, you'll be first to know about our launch and may receive early access opportunities. We respect your privacy and will never share your information.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;