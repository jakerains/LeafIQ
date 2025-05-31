import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Database } from 'lucide-react';
import { Button } from '../../components/ui/button';
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
              
              <div className="flex items-end space-x-4">
                <Button
                  onClick={handleTestConnection}
                  type="button"
                  className="flex items-center space-x-2"
                  variant="outline"
                >
                  <Activity size={16} />
                  <span>Test Connection</span>
                </Button>
                
                <Button
                  onClick={handleSyncNow}
                  type="button"
                  className="flex items-center space-x-2"
                  disabled={isSyncing}
                >
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;