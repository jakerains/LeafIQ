import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    api_key: '',
    dispensary_id: '',
    sync_frequency: 'daily',
    last_sync_timestamp: new Date().toISOString(),
    store_name: 'MARY Dispensary',
    theme_color: '#0ea5e9',
    enable_ai_features: true,
    require_staff_login: true,
    staff_passcode: '1234',
    admin_passcode: 'admin1234'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    setTimeout(() => {
      alert('Settings saved successfully');
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Settings size={20} className="text-primary-600" />
          <h2 className="text-xl font-semibold">Application Settings</h2>
        </div>
        
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-4 border-b pb-2">General Settings</h3>
              
              <div className="mb-4">
                <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  id="store_name"
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="theme_color" className="block text-sm font-medium text-gray-700 mb-1">
                  Theme Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="theme_color"
                    name="theme_color"
                    value={settings.theme_color}
                    onChange={handleChange}
                    className="w-10 h-10 rounded-lg border border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={settings.theme_color}
                    onChange={handleChange}
                    name="theme_color"
                    className="ml-2 px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enable_ai_features"
                    checked={settings.enable_ai_features}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      enable_ai_features: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable AI Features</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 border-b pb-2">Security Settings</h3>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="require_staff_login"
                    checked={settings.require_staff_login}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      require_staff_login: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Staff Login</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label htmlFor="staff_passcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="staff_passcode"
                    name="staff_passcode"
                    value={settings.staff_passcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Lock size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="admin_passcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="admin_passcode"
                    name="admin_passcode"
                    value={settings.admin_passcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Lock size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              leftIcon={<Save size={16} />}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSettings;