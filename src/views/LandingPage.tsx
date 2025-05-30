import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { FeaturesSection } from '../components/ui/bento-demo';

const LandingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-24 drop-shadow-lg filter shadow-primary-500/50"
            />
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
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                className="text-5xl lg:text-7xl font-display font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Transform Your 
                <motion.span 
                  className="relative inline-block"
                  initial={{ backgroundPosition: "0% 0%" }}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] 
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: "linear-gradient(90deg, #16a34a, #10b981, #22c55e, #16a34a)",
                    backgroundSize: "200% 100%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    display: "inline-block"
                  }}
                > Dispensary </motion.span>
                <span className="text-gray-900">Experience</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-800 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                AI-powered product recommendations, inventory management, and customer insights for modern cannabis retailers.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ShimmerButton
                  className="px-8 py-4 text-lg shadow-lg shadow-primary-500/20"
                  shimmerColor="#22c55e"
                  background="rgba(34, 197, 94, 1)"
                  onClick={() => window.location.href = '/auth/signup'}
                >
                  Get Started Now
                </ShimmerButton>
                <Link 
                  to="/demo"
                  className="px-8 py-4 text-lg border border-gray-300 backdrop-blur-sm bg-gray-100/70 rounded-full hover:bg-gray-200/80 transition-all duration-300 text-gray-900 shadow-lg"
                >
                  View Live Demo
                </Link>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Seamless Integration</span>
                </div>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-300 rounded-2xl blur opacity-30"></div>
                <img
                  src="/canifield.jpg"
                  alt="LeafIQ Dashboard"
                  className="rounded-2xl shadow-2xl relative z-10 border border-gray-300/20 backdrop-blur-sm bg-black/20"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <section className="py-20 bg-transparent bg-opacity-30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold mb-4">💵 Clear, Honest Pricing</h2>
            <p className="text-xl text-gray-600">All the power. No confusing tiers.</p>
          </div>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center items-center mb-12">
            <span className={`mr-3 font-medium ${!isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Monthly</span>
            <div 
              className="relative w-16 h-8 bg-gray-200 rounded-full cursor-pointer shadow-inner"
              onClick={() => setIsYearly(!isYearly)}
            >
              <motion.div 
                className="absolute w-6 h-6 bg-primary-500 rounded-full top-1 shadow-md"
                animate={{ x: isYearly ? 34 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            <span className={`ml-3 font-medium ${isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Yearly</span>
            {isYearly && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-medium"
              >
                Save 17% (2 months free!)
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Standard Plan"
              price={isYearly ? "$207" : "$249"}
              period={isYearly ? "/month" : "/month"}
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
              buttonText="Get Started"
              buttonLink="/auth/signup"
              highlighted
            />
            <PricingCard
              title={isYearly ? "Annual Plan" : "Premium Add-ons"}
              price={isYearly ? "$2,490" : "From $49"}
              period={isYearly ? "/year" : "/month"}
              description={isYearly ? "Commit for the year and save. Two months free!" : "Enhance your capabilities"}
              features={isYearly ? [
                'All Standard Plan Features',
                'Annual Billing (Save 17%)',
                'Cancel Anytime',
                'Priority Support',
                'Quarterly Strategy Sessions',
                'Advanced Usage Reports',
                'Early Access to New Features'
              ] : [
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

      {/* Footer */}
      <footer className="bg-white bg-opacity-90 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link to="/security" className="text-gray-600 hover:text-gray-900">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link to="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link to="/compliance" className="text-gray-600 hover:text-gray-900">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} LeafIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PricingCard = ({ 
  title, 
  price, 
  period = "", 
  description, 
  features, 
  buttonText, 
  buttonLink,
  highlighted = false 
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}) => {
  return (
    <motion.div 
      className={cn(
        `p-8 rounded-2xl ${
          highlighted 
            ? 'bg-primary-500 text-white shadow-xl scale-105' 
            : 'bg-white bg-opacity-20 backdrop-blur-lg text-gray-900 border border-white/20'
        }`
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {period && <span className="text-lg">{period}</span>}
      </div>
      <p className={`mb-6 ${highlighted ? 'text-primary-100' : 'text-gray-600'}`}>{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg 
              className={`w-5 h-5 mr-2 ${highlighted ? 'text-primary-200' : 'text-primary-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link to={buttonLink}>
        <ShimmerButton
          className="w-full"
          shimmerColor={highlighted ? "#ffffff" : "#22c55e"}
          background={highlighted ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 197, 94, 1)"}
        >
          {buttonText}
        </ShimmerButton>
      </Link>
    </motion.div>
  );
};

// Utility function for merging class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default LandingPage;