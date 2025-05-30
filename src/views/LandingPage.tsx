import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { Brain, Package, Target, Users, Zap, Lock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <Logo size="lg" />
            <div className="space-x-4">
              <Link 
                to="/auth/login"
                className="px-4 py-2 text-gray-900 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link to="/auth/signup">
                <ShimmerButton
                  shimmerColor="#22c55e"
                  background="rgba(34, 197, 94, 1)"
                  className="relative z-10"
                >
                  Get Started
                </ShimmerButton>
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
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"> Dispensary </span>
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
      <section className="py-20 bg-white bg-opacity-90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to help your dispensary thrive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-8 h-8 text-primary-600" />}
              title="AI-Powered Recommendations"
              description="Match customers with perfect products using our advanced AI engine that understands terpene profiles and desired effects."
            />
            <FeatureCard 
              icon={<Package className="w-8 h-8 text-primary-600" />}
              title="Smart Inventory Management"
              description="Real-time tracking and automated reordering suggestions to keep your best sellers in stock."
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-primary-600" />}
              title="Customer Insights"
              description="Deep analytics on customer preferences and buying patterns to optimize your product mix."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-primary-600" />}
              title="Staff Management"
              description="Role-based access control and performance tracking for your team members."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-primary-600" />}
              title="Real-time Analytics"
              description="Live dashboards showing sales, inventory levels, and customer satisfaction metrics."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-primary-600" />}
              title="Enterprise Security"
              description="Bank-grade encryption and compliance with all relevant data protection regulations."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white bg-opacity-80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Everything you need to grow your dispensary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Standard"
              price="$99"
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
              buttonText="Get Started"
              buttonLink="/auth/signup"
              highlighted
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

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div 
      className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
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
      className={`p-8 rounded-2xl ${
        highlighted 
          ? 'bg-primary-500 text-white shadow-xl scale-105' 
          : 'bg-white text-gray-900 border border-gray-100'
      }`}
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

export default LandingPage;