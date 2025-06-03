import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useProductsStore } from '../../stores/productsStore';
import SearchInput from '../../components/ui/SearchInput';
import ProductCard from '../../components/ui/ProductCard';
import Logo from '../../components/ui/Logo';
import { Button } from '../../components/ui/button';
import { LogOut, Search, LayoutDashboard, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductWithVariant } from '../../types';
import { Settings } from '../../types';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { RefreshCw, Database, Settings as SettingsIcon, Activity, Package, BrainCircuit, CreditCard, FlaskRound as Flask, Shield } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminInventory from './AdminInventory';
import AdminAIModel from './AdminAIModel';
import AdminSettings from './AdminSettings';
import SubscriptionDetails from '../account/SubscriptionDetails';
import TerpeneDatabase from './TerpeneDatabase';
import SuperadminPanel from './SuperadminPanel';
import { getUserSubscription } from '../../lib/stripe';

const AdminView = () => {
  const { logout, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [subscription, setSubscription] = useState<any>(null);
  const isSuperAdmin = role === 'super_admin';
  
  // Extract the active tab from the URL
  const getActiveTab = () => {
    if (currentPath.includes('/inventory')) return 'inventory';
    if (currentPath.includes('/ai-model')) return 'ai-model';
    if (currentPath.includes('/terpene-database')) return 'terpene-database';
    if (currentPath.includes('/settings')) return 'settings';
    if (currentPath.includes('/subscription')) return 'subscription';
    if (currentPath.includes('/superadmin')) return 'superadmin';
    return 'dashboard'; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [currentPath]);

  // Fetch subscription data
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    }

    fetchSubscription();
  }, []);

  // Handle tab clicks
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === 'dashboard' ? '' : tab}`);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-16 drop-shadow-lg filter shadow-primary-500/50"
            />
            
            <div className="flex items-center space-x-4">
              {subscription && ['active', 'trialing'].includes(subscription.subscription_status) && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Premium Plan
                </span>
              )}
              <Button 
                variant="ghost"
                leftIcon={<Home size={18} />}
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-blue-600"
              >
                Demo Hub
              </Button>
              <Button 
                variant="ghost"
                leftIcon={<LogOut size={18} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your dispensary's inventory, AI model, and system settings.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl mb-6 p-1 flex overflow-x-auto">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={16} className="mr-2" />
            Dashboard
          </button>
          
          <button
            onClick={() => handleTabClick('inventory')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'inventory'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package size={16} className="mr-2" />
            Inventory
          </button>
          
          <button
            onClick={() => handleTabClick('ai-model')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'ai-model'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BrainCircuit size={16} className="mr-2" />
            AI Model
          </button>

          <button
            onClick={() => handleTabClick('terpene-database')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'terpene-database'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Flask size={16} className="mr-2" />
            Terpene Database
          </button>
          
          <button
            onClick={() => handleTabClick('settings')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SettingsIcon size={16} className="mr-2" />
            Settings
          </button>

          <button
            onClick={() => handleTabClick('subscription')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'subscription'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={16} className="mr-2" />
            Subscription
          </button>

          {/* Super Admin Panel tab - only visible to super_admin users */}
          {isSuperAdmin && (
            <button
              onClick={() => handleTabClick('superadmin')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'superadmin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Shield size={16} className="mr-2" />
              Superadmin Panel
            </button>
          )}
        </div>
        
        {/* Routes for different admin sections */}
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/inventory" element={<AdminInventory />} />
          <Route path="/ai-model" element={<AdminAIModel />} />
          <Route path="/terpene-database" element={<TerpeneDatabase />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/superadmin" element={<SuperadminPanel />} />
          <Route path="/subscription" element={
            <div className="container mx-auto px-4">
              <SubscriptionDetails />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminView;