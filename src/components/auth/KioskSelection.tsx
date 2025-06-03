import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, LogOut, Building2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import AdminPasskeyModal from './AdminPasskeyModal';

export const KioskSelection: React.FC = () => {
  const { selectUserMode, logout, dispensaryName, getDisplayName } = useSimpleAuthStore();
  const navigate = useNavigate();
  const [showAdminPasskeyModal, setShowAdminPasskeyModal] = useState(false);

  const handleModeSelection = (mode: 'customer' | 'employee') => {
    selectUserMode(mode);
    
    // Navigate to appropriate route based on mode
    if (mode === 'customer') {
      navigate('/app/kiosk');
    } else if (mode === 'employee') {
      navigate('/app/staff');
    }
  };

  const handleAdminClick = () => {
    setShowAdminPasskeyModal(true);
  };

  const handleAdminSuccess = () => {
    selectUserMode('admin');
    navigate('/app/admin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-8 relative">
        <img 
          src="/leafiq-logo.png" 
          alt="LeafIQ" 
          className="h-16 drop-shadow-lg filter shadow-primary-500/50"
        />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-3xl font-display font-semibold mb-2">Welcome to {dispensaryName}</h2>
            <p className="text-gray-600">Please select your kiosk mode</p>
            <div className="mt-2 text-sm text-gray-500">
              Logged in: {getDisplayName()}
            </div>
          </div>

          {/* Kiosk Mode Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Customer Kiosk */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelection('customer')}
              className="cursor-pointer p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Kiosk</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse products, get recommendations, and learn about cannabis
              </p>
              <ul className="text-xs text-gray-500 space-y-1 text-left">
                <li>• Product catalog browsing</li>
                <li>• AI-powered recommendations</li>
                <li>• Terpene information</li>
                <li>• Educational content</li>
                <li>• Strain information</li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm"
              >
                Start Customer Experience
              </motion.div>
            </motion.div>

            {/* Employee Kiosk */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelection('employee')}
              className="cursor-pointer p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <UserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Kiosk</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access staff tools, inventory management, and customer assistance
              </p>
              <ul className="text-xs text-gray-500 space-y-1 text-left">
                <li>• Inventory management</li>
                <li>• Customer assistance tools</li>
                <li>• Sales analytics</li>
                <li>• Product information</li>
                <li>• Staff dashboard</li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm"
              >
                Start Employee Mode
              </motion.div>
            </motion.div>

            {/* Admin Kiosk */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdminClick}
              className="cursor-pointer p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600 mb-4">
                System administration and configuration access
              </p>
              <ul className="text-xs text-gray-500 space-y-1 text-left">
                <li>• System configuration</li>
                <li>• User management</li>
                <li>• Analytics dashboard</li>
                <li>• Database management</li>
                <li>• Security settings</li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-6 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium text-sm"
              >
                Admin Access
              </motion.div>
            </motion.div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </motion.button>
          </div>

          {/* Info Footer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              Need to switch modes later? Look for the mode switcher in the top navigation bar.
            </p>
          </div>
          </div>
        </motion.div>
      </main>

      {/* Admin Passkey Modal */}
      <AdminPasskeyModal
        isOpen={showAdminPasskeyModal}
        onClose={() => setShowAdminPasskeyModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
};