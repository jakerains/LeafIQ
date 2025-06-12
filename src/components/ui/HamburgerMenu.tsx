import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, Zap, Shield, DollarSign, Phone, Users, FileText, HelpCircle, Briefcase } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About', icon: Info },
    { to: '/features', label: 'Features', icon: Zap },
    { to: '/security', label: 'Security', icon: Shield },
    { to: '/pricing', label: 'Pricing', icon: DollarSign },
    { to: '/contact', label: 'Contact', icon: Phone },
    { to: '/careers', label: 'Careers', icon: Briefcase },
    { to: '/support', label: 'Support', icon: HelpCircle },
    { to: '/privacy', label: 'Privacy', icon: FileText },
    { to: '/terms', label: 'Terms', icon: FileText },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-6 left-6 z-[9999] p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md hover:bg-white hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </motion.div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-[9999] border-r border-gray-200"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6 pt-20">
              {/* Logo */}
              <div className="mb-8">
                <Link to="/" onClick={toggleMenu}>
                  <img 
                    src="/leafiq-logo.png" 
                    alt="LeafIQ" 
                    className="h-12 drop-shadow-lg filter shadow-primary-500/50"
                  />
                </Link>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={toggleMenu}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-600 border border-primary-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Auth Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <Link
                  to="/auth/login"
                  onClick={toggleMenu}
                  className="block w-full px-4 py-3 text-center bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={toggleMenu}
                  className="block w-full px-4 py-3 text-center bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu; 