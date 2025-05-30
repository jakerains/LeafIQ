import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '../../components/ui/pricing-card';
import { products } from '../../stripe-config';
import { getUserSubscription } from '../../lib/stripe';
import Logo from '../../components/ui/Logo';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PricingToggle } from './PricingToggle';

export default function PricingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

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

  const standardPlanFeatures = [
    {
      title: "Core Features",
      items: [
        "AI-Powered Product Matching",
        "Real-Time Inventory Sync",
        "Live Analytics & Vibe Trends",
        "Terpene Effect Explorer"
      ]
    },
    {
      title: "Team Features",
      items: [
        "Staff Dashboard & Query Logs",
        "Priority Email Support",
        "Unlimited SKUs",
        "User Management"
      ]
    }
  ];

  const premiumAddons = [
    {
      title: "Additional Features",
      items: [
        "Custom AI Model Training",
        "Multi-Location Support",
        "Custom Integrations",
        "Dedicated Account Manager"
      ]
    },
    {
      title: "Enterprise Features",
      items: [
        "Enterprise SLA",
        "Advanced Security Controls",
        "Custom Reporting",
        "Quarterly Business Reviews"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-30 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo size="md" />
            
            <div className="flex gap-4">
              <Link 
                to="/auth/login"
                className="px-6 py-3 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/30 text-gray-900 font-medium hover:bg-white/60 hover:shadow-md transition-all duration-300"
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

      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">💵 Clear, Honest Pricing</h2>
            <p className="text-xl text-gray-600">All the power. No confusing tiers.</p>
          </motion.div>
          
          <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading subscription data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <PricingCard
                title={isYearly ? "Annual Plan" : "Standard Plan"}
                description={isYearly ? "Commit for the year and save. Two months free!" : "Everything you need to run a smarter dispensary."}
                price={isYearly ? "$2,490" : "$249"}
                originalPrice={isYearly ? "$2,988" : undefined}
                period={isYearly ? "/year" : "/month"}
                features={standardPlanFeatures}
                buttonText={isYearly ? "Subscribe Annually" : "Get Started"}
                buttonLink="/auth/signup"
                highlighted
                isCurrentPlan={subscription?.price_id === products[0].priceId && 
                              ['active', 'trialing'].includes(subscription?.subscription_status)}
              />
              <PricingCard
                title="Premium Add-ons"
                description="Enhance your capabilities with enterprise-grade features"
                price="From $49"
                period="/month"
                features={premiumAddons}
                buttonText="Contact Sales"
                buttonLink="/contact"
              />
            </div>
          )}
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-display font-bold mb-6 text-center">Optional Enhancements</h3>
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
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