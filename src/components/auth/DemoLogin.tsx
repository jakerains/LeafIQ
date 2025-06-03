import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';

export const DemoLogin: React.FC = () => {
  const [email, setEmail] = useState('demo@leafiq.online');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginDispensary } = useSimpleAuthStore();
  const navigate = useNavigate();

  // Pre-fill the demo credentials when component mounts
  useEffect(() => {
    setEmail('demo@leafiq.online');
    setPassword('demo123');
  }, []);

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginDispensary(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        // On successful login, navigate to the app which will show kiosk selection
        navigate('/app');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-8 relative">
        <Link to="/">
          <img 
            src="/leafiq-logo.png" 
            alt="LeafIQ" 
            className="h-16 drop-shadow-lg filter shadow-primary-500/50"
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full relative">
            <div className="absolute top-4 left-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
            
            <div className="text-center mb-8 mt-8">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-display font-semibold mb-2">
                Demo Access
              </h2>
              <p className="text-gray-600">
                Experience LeafIQ with pre-loaded demo data
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {error && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="h-5 w-5 text-red-500 mr-2">⚠️</div>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleDemoLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      placeholder="demo@leafiq.online"
                      autoComplete="email"
                      required
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      required
                      readOnly
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleDemoLogin(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Accessing Demo...' : 'Enter Demo'}
                </button>
              </form>

              <div className="text-center">
                <span className="text-sm text-gray-600">Ready to try the full experience? </span>
                <Link
                  to="/app"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in with your account
                </Link>
              </div>

              {/* Demo info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                <h4 className="text-sm font-medium text-green-800 mb-2">🎯 What you'll see in the demo:</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Customer kiosk with AI recommendations</li>
                  <li>• Employee dashboard with inventory tools</li>
                  <li>• Admin panel with analytics</li>
                  <li>• Real cannabis product data</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}; 