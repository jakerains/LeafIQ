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
            <h2 className="text-4xl font-display font-bold mb-4">💵 Clear, Honest Pricing</h2>
            <p className="text-xl text-gray-600">All the power. No confusing tiers.</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading subscription data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                title="Standard Plan"
                price="$249"
                period="/month"
                description="Everything you need to run a smarter dispensary."
                features={[
                  'AI-Powered Product Matching',
                  'Real-Time Inventory Sync',
                  'Live Analytics & Vibe Trends',
                  'Terpene Effect Explorer',
                  'Staff Dashboard & Query Logs',
                  'Priority Email Support',
                  'Unlimited SKUs'
                ]}
                priceId={products[0].priceId}
                mode="subscription"
                buttonText="Get Started"
                highlighted
                isCurrentPlan={subscription?.price_id === products[0].priceId && 
                              ['active', 'trialing'].includes(subscription?.subscription_status)}
              />
              <PricingCard
                title="Annual Plan"
                price="$2,490"
                period="/year"
                description="Commit for the year and save. Two months free!"
                features={[
                  'All Standard Plan Features',
                  'Annual Billing (Save 17%)',
                  'Cancel Anytime',
                  'Priority Support',
                  'Quarterly Strategy Sessions',
                  'Advanced Usage Reports',
                  'Early Access to New Features'
                ]}
                buttonText="Contact Sales"
                buttonLink="/contact"
              />
            </div>
          )}
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-display font-bold mb-6 text-center">Optional Enhancements</h3>
            <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-2xl p-6">
              <p className="text-lg mb-4">Expand LeafIQ as your needs grow:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Custom AI tuning with your store's historical data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Multi-location management dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Deep POS & menu integrations (Dutchie, Jane, Weedmaps, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Dedicated account manager & enterprise SLA</span>
                </li>
              </ul>
              <div className="text-center">
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Contact Sales for details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}