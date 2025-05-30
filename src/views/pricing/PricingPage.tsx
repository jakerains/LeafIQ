import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '../../components/pricing/PricingCard';
import { products } from '../../stripe-config';
import { getUserSubscription } from '../../lib/stripe';
import Logo from '../../components/ui/Logo';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function PricingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setIsLoading(true);
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo size="md" />
            
            <div className="flex gap-4">
              <Link 
                to="/auth/login"
                className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-white hover:shadow-md transition-all duration-300"
              >
                Log In
              </Link>
              <Link 
                to="/auth/signup"
                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white bg-opacity-80">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Everything you need to grow your dispensary</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading subscription data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                title="LeafIQ Monthly"
                price="$249"
                period="/month"
                description="Complete dispensary management solution"
                features={[
                  'AI-Powered Recommendations',
                  'Unlimited Products',
                  'Real-time Inventory Management',
                  'Advanced Analytics',
                  'Staff Management',
                  'Priority Support'
                ]}
                priceId={products[0].priceId}
                mode="subscription"
                buttonText="Subscribe Now"
                highlighted
                isCurrentPlan={subscription?.price_id === products[0].priceId && 
                              ['active', 'trialing'].includes(subscription?.subscription_status)}
              />
              <PricingCard
                title="Premium Add-ons"
                price="From $49"
                period="/month"
                description="Enhance your capabilities"
                features={[
                  'Custom AI Model Training',
                  'Multi-Location Support',
                  'Custom Integrations',
                  'Dedicated Account Manager',
                  'Enterprise SLA'
                ]}
                buttonText="Contact Sales"
                buttonLink="/contact"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}