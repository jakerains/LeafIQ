import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ShimmerButton } from '../../components/ui/shimmer-button';
import { getUserSubscription } from '../../lib/stripe';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubscriptionDetails() {
      try {
        setIsLoading(true);
        const subscriptionData = await getUserSubscription();
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (sessionId) {
      fetchSubscriptionDetails();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
      >
        <div className="mx-auto bg-green-100 w-20 h-20 flex items-center justify-center rounded-full mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        
        <h2 className="text-3xl font-display font-semibold mb-4">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your subscription has been activated successfully.
        </p>
        
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-20 rounded-lg mb-6"></div>
        ) : subscription ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Subscription Details</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> {subscription.subscription_status === 'active' ? 
                <span className="text-green-600">Active</span> : 
                <span className="text-yellow-600">Processing</span>
              }
            </p>
            {subscription.current_period_end && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Next billing date:</span> {' '}
                {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Your subscription is being processed. It may take a few moments to appear in your account.
            </p>
          </div>
        )}
        
        <ShimmerButton
          className="w-full"
          shimmerColor="#22c55e"
          background="rgba(34, 197, 94, 1)"
          onClick={() => navigate('/admin')}
        >
          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
        </ShimmerButton>
      </motion.div>
    </div>
  );
}