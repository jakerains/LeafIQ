import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Users, ShoppingBag, Brain, Settings, User } from 'lucide-react';
import Logo from '../components/ui/Logo';
import GlassCard from '../components/ui/GlassCard';
import { ShimmerButton } from '../components/ui/shimmer-button';

const DemoView = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <header className="flex flex-col items-center mb-16">
          <Link to="/" className="mb-8">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-24 drop-shadow-lg filter shadow-primary-500/50"
            />
          </Link>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Experience LeafIQ
              <span className="text-primary-600"> Live Demo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore both sides of our cannabis dispensary platform. Experience the customer journey 
              or dive into the powerful admin tools that make it all possible.
            </p>
          </motion.div>
        </header>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Customer Experience Card */}
          <motion.div variants={item}>
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 mr-4">
                  <ShoppingBag size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Kiosk</h2>
                  <p className="text-gray-600">Experience shopping from the customer's perspective</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-blue-500" />
                  <span className="text-gray-700">AI-powered product recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-blue-500" />
                  <span className="text-gray-700">Interactive chat interface</span>
                </div>
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-500" />
                  <span className="text-gray-700">Personalized shopping experience</span>
                </div>
              </div>
              
              <Link to="/kiosk" className="block">
                <ShimmerButton
                  className="w-full py-4 text-lg"
                  shimmerColor="#3b82f6"
                  background="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                >
                  Try Customer Experience
                </ShimmerButton>
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  No login required • Full functionality
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Admin/Staff Experience Card */}
          <motion.div variants={item}>
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 mr-4">
                  <Settings size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                  <p className="text-gray-600">Explore the management and analytics tools</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-green-500" />
                  <span className="text-gray-700">Staff and inventory management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-green-500" />
                  <span className="text-gray-700">AI model configuration</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-green-500" />
                  <span className="text-gray-700">Real-time analytics dashboard</span>
                </div>
              </div>
              
              <Link to="/auth/login" className="block">
                <ShimmerButton
                  className="w-full py-4 text-lg"
                  shimmerColor="#22c55e"
                  background="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                >
                  Login to Admin Demo
                </ShimmerButton>
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Demo codes: Staff (1234) • Admin (admin1234)
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What makes LeafIQ special?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Brain size={24} className="text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                <p className="text-gray-600 text-sm">Advanced recommendation engine that learns customer preferences</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Monitor size={24} className="text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Real-time Data</h4>
                <p className="text-gray-600 text-sm">Live inventory tracking and customer insights</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">User-Friendly</h4>
                <p className="text-gray-600 text-sm">Intuitive interfaces for both customers and staff</p>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-opacity-90 shadow-sm transition-all duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoView; 