import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  Bot, 
  Leaf, 
  Users, 
  Database,
  Search,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Globe
} from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';
import HamburgerMenu from '../components/ui/HamburgerMenu';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hamburger Menu */}
      <HamburgerMenu />
      
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img 
                src="/leafiq-logo.png" 
                alt="LeafIQ" 
                className="h-16 drop-shadow-lg filter shadow-primary-500/50"
              />
            </Link>
            
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
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                Intelligent Cannabis
              </span>
              <br />
              <span className="text-gray-900">Retail Technology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your dispensary with AI-powered product matching, real-time inventory sync, 
              and intelligent customer recommendations that drive sales and enhance experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/demo-login"
                className="px-8 py-4 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Try Live Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/auth/signup"
                className="px-8 py-4 border border-gray-300 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a smarter, more efficient dispensary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: "AI-Powered Recommendations",
                description: "Advanced machine learning algorithms analyze customer preferences, purchase history, and product characteristics to deliver personalized cannabis recommendations.",
                features: ["Neural network matching", "Real-time learning", "Preference tracking", "Effect-based suggestions"]
              },
              {
                icon: Zap,
                title: "Real-Time Inventory Sync",
                description: "Seamlessly integrate with major POS systems for instant inventory updates, preventing overselling and ensuring accurate product availability.",
                features: ["Live inventory tracking", "Multi-platform sync", "Auto-reorder alerts", "Stock level optimization"]
              },
              {
                icon: Bot,
                title: "Intelligent Chatbot",
                description: "24/7 AI budtender that answers customer questions, explains effects, and guides product selection with expert-level cannabis knowledge.",
                features: ["Natural language processing", "Cannabis expertise", "Multi-language support", "Learning conversations"]
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Comprehensive business intelligence dashboard with sales trends, customer insights, and performance metrics to drive informed decisions.",
                features: ["Sales forecasting", "Customer segmentation", "Performance KPIs", "Custom reporting"]
              },
              {
                icon: Leaf,
                title: "Terpene Profile Matching",
                description: "Deep terpene analysis and effect prediction to help customers find products that match their desired experience and medical needs.",
                features: ["Terpene database", "Effect prediction", "Strain comparison", "Medical matching"]
              },
              {
                icon: Users,
                title: "Staff Training Tools",
                description: "Interactive training modules and knowledge base to keep your team educated on products, regulations, and best practices.",
                features: ["Interactive modules", "Compliance training", "Product knowledge", "Performance tracking"]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-full rounded-2xl border-[0.75px] border-gray-200/50 p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={70}
                    inactiveZone={0.05}
                    borderWidth={2}
                    movementDuration={1.8}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Technical Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on cutting-edge technology for enterprise-grade performance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Database,
                  title: "Enterprise Database",
                  description: "Scalable PostgreSQL with real-time sync, automated backups, and 99.9% uptime guarantee."
                },
                {
                  icon: Shield,
                  title: "Security & Compliance",
                  description: "SOC 2 compliant infrastructure with end-to-end encryption and cannabis industry compliance."
                },
                {
                  icon: Globe,
                  title: "API-First Architecture",
                  description: "RESTful APIs and GraphQL endpoints for seamless integration with existing systems."
                },
                {
                  icon: TrendingUp,
                  title: "Machine Learning",
                  description: "Advanced ML models for demand forecasting, recommendation engines, and predictive analytics."
                }
              ].map((capability, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <capability.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                    <p className="text-gray-600">{capability.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <motion.div
                className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlowingEffect
                  spread={45}
                  glow={true}
                  disabled={false}
                  proximity={80}
                  inactiveZone={0.05}
                  borderWidth={2}
                  movementDuration={2}
                />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">System Performance</span>
                    <span className="text-sm text-green-600">All Systems Operational</span>
                  </div>
                  
                  {[
                    { label: "API Response Time", value: "< 100ms", percentage: 95 },
                    { label: "Uptime", value: "99.9%", percentage: 99 },
                    { label: "Data Accuracy", value: "99.8%", percentage: 98 },
                    { label: "Customer Satisfaction", value: "4.9/5", percentage: 92 }
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="text-sm text-gray-600">{metric.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 -right-32 -top-32"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl mb-6">
              <Globe className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-gray-900">Seamless </span>
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Integrations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Connect with the cannabis industry's leading POS systems and platforms
            </p>
            <p className="text-sm text-gray-500">
              ✓ One-click setup • ✓ Real-time sync • ✓ Zero downtime migration
            </p>
          </motion.div>

          {/* Featured Integrations */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              🏆 Most Popular Integrations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Dutchie",
                  description: "Leading cannabis e-commerce platform",
                  icon: "🛍️",
                  color: "from-blue-500 to-purple-600",
                  features: ["E-commerce", "Online Orders", "Delivery"]
                },
                {
                  name: "Jane",
                  description: "Comprehensive cannabis software suite",
                  icon: "🌿",
                  color: "from-green-500 to-emerald-600",
                  features: ["POS", "Inventory", "Compliance"]
                },
                {
                  name: "Weedmaps",
                  description: "Cannabis discovery and ordering",
                  icon: "🗺️",
                  color: "from-orange-500 to-red-600",
                  features: ["Marketing", "Discovery", "Reviews"]
                },
                {
                  name: "Leafly",
                  description: "Cannabis information and marketplace",
                  icon: "🍃",
                  color: "from-emerald-500 to-green-600",
                  features: ["Strain Data", "Education", "Marketplace"]
                }
              ].map((integration, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2 h-full">
                    <GlowingEffect
                      spread={35}
                      glow={true}
                      disabled={false}
                      proximity={70}
                      inactiveZone={0.05}
                      borderWidth={2}
                      movementDuration={1.8}
                    />
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full flex flex-col">
                      <div className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{integration.icon}</span>
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600 mb-4 flex-grow">{integration.description}</p>
                      <div className="space-y-1">
                        {integration.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-500">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Integrations Grid */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              📊 POS & Compliance Systems
            </h3>
            <p className="text-gray-600 mb-8">
              We integrate with all major cannabis business platforms
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {[
                { name: "MJ Freeway", icon: "⚡", category: "POS" },
                { name: "BioTrack", icon: "🧬", category: "Compliance" },
                { name: "Flowhub", icon: "🌊", category: "POS" },
                { name: "Treez", icon: "🌳", category: "E-commerce" },
                { name: "POSaBIT", icon: "💳", category: "Payments" },
                { name: "Cova", icon: "🛡️", category: "POS" },
                { name: "GreenBits", icon: "💚", category: "Software" },
                { name: "Terpli", icon: "🧪", category: "Analytics" }
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  className="group h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="relative h-full rounded-xl border-[0.75px] border-gray-200/50 p-2">
                    <GlowingEffect
                      spread={30}
                      glow={true}
                      disabled={false}
                      proximity={60}
                      inactiveZone={0.05}
                      borderWidth={2}
                      movementDuration={1.5}
                    />
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer h-full">
                      <div className="text-center h-full flex flex-col justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-300">
                          <span className="text-lg">{partner.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{partner.name}</h4>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {partner.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Integration Benefits */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl border-[0.75px] border-primary-200/50 p-2 max-w-4xl mx-auto">
              <GlowingEffect
                spread={50}
                glow={true}
                disabled={false}
                proximity={100}
                inactiveZone={0.05}
                borderWidth={2}
                movementDuration={2.2}
              />
              <div className="relative bg-gradient-to-br from-primary-50 to-emerald-50 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  🚀 Why Our Integrations Are Different
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Instant Setup</h4>
                    <p className="text-sm text-gray-600">Connect in under 5 minutes with pre-built connectors</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Database className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Real-Time Sync</h4>
                    <p className="text-sm text-gray-600">Bidirectional data flow keeps everything in sync</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Zero Downtime</h4>
                    <p className="text-sm text-gray-600">Migrate without interrupting your business</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link 
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Request Integration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-emerald-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Ready to Transform Your Dispensary?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join leading dispensaries using LeafIQ to increase sales, improve customer satisfaction, and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/signup"
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Start Free Trial
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/demo-login"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-medium hover:bg-white hover:text-primary-600 transition-all duration-300"
              >
                Try Demo
              </Link>
            </div>
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

export default FeaturesPage; 