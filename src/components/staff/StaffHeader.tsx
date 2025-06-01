import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Shield, 
  Bell, 
  User, 
  Clock,
  ChevronDown,
  X 
} from 'lucide-react';
import { Button } from '../ui/button';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import { useStaffModeStore } from '../../stores/staffModeStore';
import { useNavigate } from 'react-router-dom';

export const StaffHeader: React.FC = () => {
  const { logout, selectUserMode, dispensaryName, username, isAdmin } = useSimpleAuthStore();
  const { notifications, removeNotification, clearNotifications } = useStaffModeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    const passkey = prompt('Enter admin passkey:');
    if (passkey === '1234') {
      selectUserMode('admin');
      navigate('/admin');
    } else if (passkey !== null) {
      alert('Invalid passkey');
    }
  };

  const unreadNotifications = notifications.length;

  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img 
            src="/leafiq-logo.png" 
            alt="LeafIQ" 
            className="h-16 drop-shadow-lg filter shadow-primary-500/50"
          />
          
          {/* Center - Employee Info */}
          <div className="hidden md:flex flex-col items-center">
            <div className="flex items-center space-x-2 text-sm">
              <User size={16} className="text-gray-500" />
              <span className="font-medium text-gray-700">Staff Mode</span>
            </div>
            <div className="text-xs text-gray-500">
              {dispensaryName}
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 border-b border-gray-50 hover:bg-gray-50 group"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className={`
                                  text-sm font-medium
                                  ${notification.type === 'error' ? 'text-red-700' : ''}
                                  ${notification.type === 'warning' ? 'text-yellow-700' : ''}
                                  ${notification.type === 'success' ? 'text-green-700' : ''}
                                  ${notification.type === 'info' ? 'text-blue-700' : ''}
                                `}>
                                  {notification.message}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {notification.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm">{username?.split('@')[0]}</span>
                <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </Button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900 text-sm">{username}</div>
                      <div className="text-xs text-gray-500">Employee • {dispensaryName}</div>
                    </div>
                    
                    {!isAdmin && (
                      <button
                        onClick={handleAdminAccess}
                        className="w-full px-3 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                      >
                        <Shield size={16} />
                        <span>Switch to Admin</span>
                      </button>
                    )}
                    
                    <button
                      onClick={logout}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 