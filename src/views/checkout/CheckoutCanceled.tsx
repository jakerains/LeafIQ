import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShimmerButton } from '../../components/ui/shimmer-button';

export default function CheckoutCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
      >
        <div className="mx-auto bg-red-100 w-20 h-20 flex items-center justify-center rounded-full mb-6">
          <XCircle className="text-red-600" size={40} />
        </div>
        
        <h2 className="text-3xl font-display font-semibold mb-4">
          Payment Canceled
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your payment was canceled and you have not been charged. If you have any questions, please contact our support team.
        </p>
        
        <ShimmerButton
          className="w-full"
          shimmerColor="#22c55e"
          background="rgba(34, 197, 94, 1)"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
        </ShimmerButton>
      </motion.div>
    </div>
  );
}