import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Users, ShoppingBag, Brain, Settings, User, ClipboardList, BarChart3, Package } from 'lucide-react';
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
              Explore all aspects of our cannabis dispensary platform. From customer experience 
              to staff operations and admin management.
            </p>
          </motion.div>
        </header>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Customer Kiosk Card */}
          <motion.div variants={item}>
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 mr-4">
                  <ShoppingBag size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Kiosk</h2>
                  <p className="text-gray-600 text-sm">Self-service shopping experience</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-blue-500" />
                  <span className="text-gray-700 text-sm">AI-powered recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-blue-500" />
                  <span className="text-gray-700 text-sm">Interactive chat interface</span>
                </div>
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-500" />
                  <span className="text-gray-700 text-sm">Personalized shopping</span>
                </div>
              </div>
              
              <Link to="/kiosk" className="block">
                <ShimmerButton
                  className="w-full py-4 text-lg"
                  shimmerColor="#3b82f6"
                  background="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                >
                  Try Customer Kiosk
                </ShimmerButton>
              </Link>
              
              <div className="mt-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-1">Open Access:</p>
                  <p className="text-xs text-blue-700">
                    No login required<br />
                    Full kiosk functionality
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Staff Dashboard Card */}
          <motion.div variants={item}>
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 mr-4">
                  <ClipboardList size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Dashboard</h2>
                  <p className="text-gray-600 text-sm">Employee tools & operations</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-orange-500" />
                  <span className="text-gray-700 text-sm">Inventory management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-orange-500" />
                  <span className="text-gray-700 text-sm">Customer assistance tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-orange-500" />
                  <span className="text-gray-700 text-sm">Sales tracking</span>
                </div>
              </div>
              
              <Link to="/auth/login?role=staff" className="block">
                <ShimmerButton
                  className="w-full py-4 text-lg"
                  shimmerColor="#f97316"
                  background="linear-gradient(135deg, #f97316 0%, #f59e0b 100%)"
                >
                  Login as Staff
                </ShimmerButton>
              </Link>
              
              <div className="mt-4 text-center">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-orange-800 mb-1">Demo Credentials:</p>
                  <p className="text-xs text-orange-700">
                    Email: staff@leafiq.online<br />
                    Password: staff1234
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Admin Dashboard Card */}
          <motion.div variants={item}>
            <GlassCard className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 mr-4">
                  <Settings size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                  <p className="text-gray-600 text-sm">Full management & analytics</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-green-500" />
                  <span className="text-gray-700 text-sm">Complete staff management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-green-500" />
                  <span className="text-gray-700 text-sm">AI model configuration</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-green-500" />
                  <span className="text-gray-700 text-sm">Analytics & reporting</span>
                </div>
              </div>
              
              <Link to="/auth/login?role=admin" className="block">
                <ShimmerButton
                  className="w-full py-4 text-lg"
                  shimmerColor="#22c55e"
                  background="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                >
                  Login as Admin
                </ShimmerButton>
              </Link>
              
              <div className="mt-4 text-center">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-800 mb-1">Demo Credentials:</p>
                  <p className="text-xs text-green-700">
                    Email: demo@leafiq.online<br />
                    Password: demo1234
                  </p>
                </div>
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
                <p className="text-gray-600 text-sm">Intuitive interfaces for customers, staff, and admins</p>
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