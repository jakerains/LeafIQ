import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { FeaturesSection } from '../components/ui/bento-demo';

const LandingPage = () => {
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
                <span className="text-gray-900">Intelligent Cannabis Retail,</span>
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
                > Powered by AI </motion.span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-800 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Deliver smarter recommendations, sharper insights, and better service—on autopilot.
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

      {/* Transform Your Dispensary Experience Section */}
      <section className="py-20 bg-white bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl lg:text-4xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🚀 Transform Your Dispensary Experience
          </motion.h2>
          <motion.p
            className="text-xl text-gray-800 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            LeafIQ is your all-in-one AI platform for personalized product discovery, real-time inventory intelligence, and customer-driven insights—designed specifically for modern cannabis retailers.
          </motion.p>
        </div>
      </section>

      {/* Why LeafIQ Section */}
      <section className="py-24 relative overflow-hidden bg-transparent backdrop-blur-lg">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-primary-500"/>
            </svg>
          </div>
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-primary-100/30 -right-20 -top-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-accent-100/30 -left-40 bottom-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">⚡ Why LeafIQ?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered Product Matching"
              description="Instantly connect shoppers with the perfect product based on how they want to feel. LeafIQ uses terpene profiles and cannabinoid data—not guesswork—to deliver real results."
              index={0}
              icon="Brain"
            />
            <FeatureCard
              title="Live Inventory Sync"
              description="Your menu is always accurate. LeafIQ pulls directly from your POS or ecommerce backend to reflect what's truly in stock—down to the variant."
              index={1}
              icon="Database"
              color="secondary"
            />
            <FeatureCard
              title="Smart Terpene Intelligence"
              description="Give your staff superpowers. Every strain recommendation comes backed by transparent terpene breakdowns and effect logic."
              index={2}
              icon="Leaf"
              color="accent"
            />
            <FeatureCard
              title="Customer Behavior Analytics"
              description="Understand buying patterns, top search intents, and strain sentiment to stock smarter and sell faster."
              index={3}
              icon="LineChart"
              color="primary"
            />
            <FeatureCard
              title="Built-In Staff Tools"
              description="Role-based dashboards and query logs help your team stay sharp and aligned, with less training required."
              index={4}
              icon="UserCircle"
              color="secondary"
            />
            <FeatureCard
              title="Privacy-First Architecture"
              description="Enterprise-grade security and full compliance with data regulations. LeafIQ is built with trust in mind."
              index={5}
              icon="ShieldCheck"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-20 bg-white bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl lg:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            📊 The LeafIQ Dashboard
          </motion.h2>
          <motion.p
            className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need. Nothing you don't.
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A beautifully simple interface for customers, budtenders, and managers alike. From touchscreen kiosks to back-office metrics, LeafIQ connects every layer of your operation.
          </motion.p>
          
          <motion.div
            className="rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img 
              src="/canifield.jpg" 
              alt="LeafIQ Dashboard" 
              className="w-full h-auto rounded-2xl border border-gray-200 shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">💵 Simple, Transparent Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Standard Plan"
              price="$249"
              period="/month"
              description="Ideal for single-location dispensaries ready to modernize."
              features={[
                'AI-Powered Product Recommendations',
                'Real-Time Inventory Sync',
                'Terpene-Based Search Matching',
                'Live Analytics Dashboard',
                'Unlimited Product Listings',
                'Role-Based Staff Access',
                'Priority Email Support'
              ]}
              buttonText="Get Started"
              buttonLink="/auth/signup"
              highlighted
            />
            <div className="space-y-8">
              <PricingCard
                title="Annual Plan"
                price="$2,490"
                period="/year"
                description="2 months free when you pay annually."
                features={[
                  'All Standard Plan Features',
                  'Two Months Free',
                  'Annual Strategic Review',
                  'Enhanced Support SLA',
                  'No Hidden Fees',
                  'Cancel Anytime'
                ]}
                buttonText="Save With Annual"
                buttonLink="/auth/signup"
              />
              
              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Add-On Options</h3>
                <p className="text-gray-600 mb-4">Starting at $99/month</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Custom AI Tuning (Based on Your Sales Data)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multi-Store Support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dutchie / Jane / Weedmaps Deep Integration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated Account Manager
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    SLA & Compliance Reporting
                  </li>
                </ul>
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white bg-opacity-30 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h2 
            className="text-3xl lg:text-4xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            🌱 About LeafIQ
          </motion.h2>
          <motion.p
            className="text-xl text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We believe dispensaries deserve smarter tools. LeafIQ helps modern cannabis retailers deliver hyper-personalized experiences, powered by science—not strain names.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ShimmerButton
              className="px-8 py-4 text-lg shadow-lg shadow-primary-500/20 mx-auto"
              shimmerColor="#22c55e"
              background="rgba(34, 197, 94, 1)"
              onClick={() => window.location.href = '/auth/signup'}
            >
              Get Started Today
            </ShimmerButton>
          </motion.div>
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

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  index, 
  color = "primary" 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  index: number;
  color?: "primary" | "secondary" | "accent" 
}) => {
  const colorMap = {
    primary: {
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
      hoverBg: "group-hover:bg-primary-50",
      shadowColor: "group-hover:shadow-primary-500/10"
    },
    secondary: {
      iconBg: "bg-secondary-50",
      iconColor: "text-secondary-600",
      hoverBg: "group-hover:bg-secondary-50",
      shadowColor: "group-hover:shadow-secondary-500/10"
    },
    accent: {
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      hoverBg: "group-hover:bg-accent-50",
      shadowColor: "group-hover:shadow-accent-500/10"
    }
  };

  let IconComponent;
  switch (icon) {
    case "Brain":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M8.5 12C8.5 12 10.5 11 10.5 8.5C10.5 6 9 4.5 7 4.5C5 4.5 3.5 6 3.5 8.5C3.5 11 5.5 12 5.5 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.5 12C15.5 12 13.5 11 13.5 8.5C13.5 6 15 4.5 17 4.5C19 4.5 20.5 6 20.5 8.5C20.5 11 18.5 12 18.5 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7.5V11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13C8 13 8 17.5 12 17.5C16 17.5 16 13 16 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 20C10 20 10 18.5 12 17.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 20C14 20 14 18.5 12 17.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    case "Database":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M4 18V6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 6V18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18C16.4183 18 20 16.2091 20 14V6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6V14C4 16.2091 7.58172 18 12 18Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 14C4 16.2091 7.58172 18 12 18C16.4183 18 20 16.2091 20 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 22H10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    case "Leaf":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M12 22C8 18 4 14 4 10C4 6 7 3 11 3C15 3 20 6 20 10C20 14 16 18 12 22Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C16 18 20 14 20 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.18359 12.1767L15.1836 9.82327" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    case "LineChart":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 16L16.0811 12.0811C16.0295 12.0295 16.0037 12.0037 15.9739 11.9918C15.9475 11.9812 15.9184 11.9812 15.892 11.9918C15.8622 12.0037 15.8364 12.0295 15.7848 12.0811L13.2152 14.6507C13.1636 14.7023 13.1378 14.7281 13.108 14.74C13.0816 14.7506 13.0525 14.7506 13.0261 14.74C12.9963 14.7281 12.9705 14.7023 12.9189 14.6507L10.3493 12.0811C10.2977 12.0295 10.2719 12.0037 10.2421 11.9918C10.2157 11.9812 10.1866 11.9812 10.1602 11.9918C10.1304 12.0037 10.1046 12.0295 10.053 12.0811L7 15.1341" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    case "UserCircle":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    case "ShieldCheck":
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M9 12L11 14L15 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2C8.25027 5.73837 2 7.696 2 7.696V14.0152C2 17.9335 5.17111 22.2336 12 22C18.8289 22.2336 22 17.9335 22 14.0152V7.696C22 7.696 15.7497 5.73837 12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      break;
    default:
      IconComponent = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
          <path d="M12 16V21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12V14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 7.5L4.5 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 16.5L4.5 19.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 16.5L19.5 19.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 7.5L19.5 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group p-8 bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${colorMap[color].hoverBg} ${colorMap[color].shadowColor}`}
    >
      <div className={`w-14 h-14 ${colorMap[color].iconBg} rounded-xl flex items-center justify-center mb-6`}>
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className={`${colorMap[color].iconColor}`}
        >
          <IconComponent />
        </motion.div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <motion.button
        whileHover={{ x: 5 }}
        className="text-sm font-medium inline-flex items-center text-gray-700 hover:text-gray-900"
      >
        Learn more
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
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
      className={cn(
        `p-8 rounded-2xl ${
          highlighted 
            ? 'bg-primary-500 text-white shadow-xl scale-105' 
            : 'bg-white text-gray-900 border border-gray-100'
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