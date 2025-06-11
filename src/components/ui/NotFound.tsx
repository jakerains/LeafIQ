import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Leaf, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 with Cannabis Theme */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.h1
              className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.h1>
            
            {/* Floating Leaf Icons */}
            <motion.div
              className="absolute top-4 left-1/4 text-green-400"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Leaf size={32} />
            </motion.div>
            
            <motion.div
              className="absolute top-8 right-1/4 text-emerald-400"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <Leaf size={24} />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-xl text-gray-300 mb-2">
            Looks like this page went up in smoke! 💨
          </p>
          
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* LeafIQ Branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-white">LeafIQ</span>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <p className="text-gray-200 text-sm">
              Cannabis retail intelligence and customer experience platform
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              <Home size={18} />
              Home
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/app"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white bg-opacity-10 text-white border border-white/20 rounded-xl font-medium hover:bg-opacity-20 transition-all duration-200 backdrop-blur-sm"
            >
              <Search size={18} />
              Browse Products
            </Link>
          </motion.div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-gray-400 text-sm mb-4">
            Need help? Try these popular destinations:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              to="/app" 
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Customer Kiosk
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/staff" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Staff Portal
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/admin" 
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <Leaf size={20 + Math.random() * 20} className="text-green-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound; 