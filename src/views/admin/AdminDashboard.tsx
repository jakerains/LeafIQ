import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Database } from 'lucide-react';
import Button from '../../components/ui/button';
import { useProductsStore } from '../../stores/productsStore';

const AdminDashboard = () => {
  const { products, variants } = useProductsStore();
  const [settings, setSettings] = useState({
    api_key: '',
    dispensary_id: '',
    sync_frequency: 'daily',
    last_sync_timestamp: new Date().toISOString()
  });
  
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTestConnection = () => {
    // Simulate API connection test
    setIsApiConnected(false);
    setTimeout(() => {
      if (settings.api_key && settings.dispensary_id) {
        setIsApiConnected(true);
        alert('Connection successful!');
      } else {
        alert('Please enter valid API credentials');
      }
    }, 1000);
  };

  const handleSyncNow = () => {
    // Simulate sync process
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSettings(prev => ({
        ...prev,
        last_sync_timestamp: new Date().toISOString()
      }));
      alert('Sync completed successfully');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-2"
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">API Configuration</h2>
          </div>
          
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-1">
                  Dutchie API Key
                </label>
                <input
                  type="text"
                  id="api_key"
                  name="api_key"
                  value={settings.api_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, api_key: e.target.value }))}
                  className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter API key"
                />
              </div>
              
              <div>
                <label htmlFor="dispensary_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Dispensary ID
                </label>
                <input
                  type="text"
                  id="dispensary_id"
                  name="dispensary_id"
                  value={settings.dispensary_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, dispensary_id: e.target.value }))}
                  className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter dispensary ID"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="sync_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Frequency
                </label>
                <select
                  id="sync_frequency"
                  name="sync_frequency"
                  value={settings.sync_frequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, sync_frequency: e.target.value }))}
                  className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="manual">Manual Only</option>
                  <option value="15min">Every 15 Minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="button" 
                  variant="secondary"
                  leftIcon={<Database size={16} />}
                  onClick={handleTestConnection}
                >
                  Test Connection
                </Button>
                {isApiConnected && (
                  <span className="ml-3 text-green-600 flex items-center">
                    Connected
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </div>
        
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <RefreshCw size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">Sync Management</h2>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Last Successful Sync</span>
              <span className="text-sm text-gray-600">
                {new Date(settings.last_sync_timestamp || '').toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sync Frequency</span>
              <span className="text-sm text-gray-600">
                {settings.sync_frequency === 'manual' ? 'Manual Only' :
                 settings.sync_frequency === '15min' ? 'Every 15 Minutes' :
                 settings.sync_frequency === 'hourly' ? 'Hourly' : 'Daily'}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Next Scheduled Sync</span>
              <span className="text-sm text-gray-600">
                {settings.sync_frequency === 'manual' 
                  ? 'Manual Only' 
                  : new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="accent"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleSyncNow}
              isLoading={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">System Status</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Products in Database</span>
                <span className="text-sm text-gray-900 font-semibold">{products.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (products.length / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">API Health</span>
                <span className="text-sm text-gray-900 font-semibold">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Searches Today</span>
                <span className="text-sm text-gray-900 font-semibold">12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm text-gray-900 font-semibold">0.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-3">Popular Searches</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>relaxed</span>
              <span className="text-sm text-gray-600">5 searches</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>pain relief</span>
              <span className="text-sm text-gray-600">3 searches</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>energized</span>
              <span className="text-sm text-gray-600">2 searches</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span>creative</span>
              <span className="text-sm text-gray-600">2 searches</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;