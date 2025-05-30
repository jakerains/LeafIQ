import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserSubscription, getProductByPriceId } from '../../lib/stripe';
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ShimmerButton } from '../../components/ui/shimmer-button';

export default function SubscriptionDetails() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" /> Trial
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Past Due
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const product = subscription?.price_id ? getProductByPriceId(subscription.price_id) : null;

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Subscription Details</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      ) : !subscription || subscription.subscription_status === 'not_started' ? (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
          <ShimmerButton
            className="mx-auto"
            shimmerColor="#22c55e"
            background="rgba(34, 197, 94, 1)"
            onClick={() => window.location.href = '/pricing'}
          >
            View Plans
          </ShimmerButton>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Plan Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Plan</span>
                  <p className="font-medium">{product?.name || 'Unknown Plan'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status</span>
                  <p>{getStatusBadge(subscription.subscription_status)}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Billing Period</span>
                  <p className="font-medium">
                    {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Auto Renewal</span>
                  <p className="font-medium">
                    {subscription.cancel_at_period_end ? 'Off' : 'On'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              {subscription.payment_method_brand ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg mr-3">
                      <CreditCard className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{subscription.payment_method_brand}</p>
                      <p className="text-gray-500 text-sm">
                        •••• •••• •••• {subscription.payment_method_last4}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No payment method information available.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Subscription Management</h3>
            <div className="flex flex-wrap gap-3">
              <ShimmerButton
                shimmerColor="#ffffff"
                background="rgba(239, 68, 68, 0.1)"
                className="text-red-600 border border-red-200"
                onClick={() => alert('This would cancel your subscription in a real implementation')}
              >
                {subscription.cancel_at_period_end ? 'Resume Subscription' : 'Cancel Subscription'}
              </ShimmerButton>
              <ShimmerButton
                shimmerColor="#ffffff"
                background="rgba(59, 130, 246, 0.1)"
                className="text-blue-600 border border-blue-200"
                onClick={() => alert('This would update your payment method in a real implementation')}
              >
                Update Payment Method
              </ShimmerButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}