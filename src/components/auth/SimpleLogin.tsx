import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';

export const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginDispensary } = useSimpleAuthStore();

  const handleDispensaryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginDispensary(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      // On success, the auth store will update and trigger navigation
    } catch {
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
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-display font-semibold mb-2">
                Sign In
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
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

              <form onSubmit={handleDispensaryLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      required
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleDispensaryLogin(e);
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
                  className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>



              <div className="text-center">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link
                  to="/auth/signup"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign up here
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}; 