import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, LogOut, Building2, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';

export const KioskSelection: React.FC = () => {
  const { selectUserMode, logout, dispensaryName, getDisplayName } = useSimpleAuthStore();
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setShowAdminModal(true);
    setAdminPasskey('');
    setAdminError('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAdminError('');

    // Simple passkey validation
    if (adminPasskey === '1234') {
      selectUserMode('admin');
      setShowAdminModal(false);
      navigate('/app/admin'); // Navigate to admin panel
    } else {
      setAdminError('Invalid admin passkey');
    }
    setIsLoading(false);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminPasskey('');
    setAdminError('');
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
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-2">Welcome to {dispensaryName}</h2>
            <p className="text-gray-600">Please select your kiosk mode</p>
            <div className="mt-2 text-sm text-gray-500">
              Logged in: {getDisplayName()}
            </div>
          </div>

          {/* Kiosk Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
            {/* Customer Kiosk */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelection('customer')}
              className="cursor-pointer p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group text-center h-full"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Customer Kiosk</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
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
              className="cursor-pointer p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-center h-full"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Employee Kiosk</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
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
              className="cursor-pointer p-4 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group text-center h-full"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
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
          <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              Need to switch modes later? Look for the mode switcher in the top navigation bar.
            </p>
          </div>
          </div>
        </motion.div>
      </main>

      {/* Admin Passkey Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeAdminModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-6 sm:p-8 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
                <p className="text-gray-600">Enter the admin passkey to continue</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label htmlFor="adminPasskey" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Passkey
                  </label>
                  <div className="relative">
                    <input
                      id="adminPasskey"
                      type={showPasskey ? "text" : "password"}
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                      placeholder="Enter admin passkey"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasskey(!showPasskey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {adminError}
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={closeAdminModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Access Admin'
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Demo passkey hint */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 text-center">
                <strong>Demo passkey:</strong> 1234
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};