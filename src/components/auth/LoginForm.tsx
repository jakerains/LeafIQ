import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  role?: UserRole;
}

const LoginForm = ({ role: requiredRole }: LoginFormProps) => {
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'passcode' | 'supabase'>('passcode');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePasscodeLogin = (selectedRole: UserRole) => {
    if (!selectedRole) return;
    
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(selectedRole, passcode);
      if (success) {
        const from = (location.state as any)?.from?.pathname || `/${selectedRole}`;
        navigate(from, { replace: true });
      } else {
        setError('Invalid passcode. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSupabaseLogin = async () => {
    // TODO: Implement Supabase authentication
    setError('Supabase authentication not yet implemented');
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'staff': return 'Staff Member';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-semibold mb-2">Welcome Back</h2>
        {requiredRole && (
          <p className="text-gray-600">
            Sign in as {getRoleDisplayName(requiredRole)}
          </p>
        )}
      </div>

      {/* Login Type Selector */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setLoginType('passcode')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            loginType === 'passcode'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Quick Access
        </button>
        <button
          onClick={() => setLoginType('supabase')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            loginType === 'supabase'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Account Login
        </button>
      </div>

      {loginType === 'passcode' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter access code"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && requiredRole) {
                    handlePasscodeLogin(requiredRole);
                  }
                }}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {requiredRole ? (
            <Button
              onClick={() => handlePasscodeLogin(requiredRole)}
              disabled={isLoading || !passcode}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Signing In...' : `Sign In as ${getRoleDisplayName(requiredRole)}`}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={() => handlePasscodeLogin('staff')}
                disabled={isLoading || !passcode}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Staff'}
              </Button>
              <Button
                onClick={() => handlePasscodeLogin('admin')}
                disabled={isLoading || !passcode}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>Demo codes: Staff (1234) | Admin (admin1234)</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <Button
            onClick={handleSupabaseLogin}
            disabled={isLoading || !email || !password}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <a href="/auth/signup" className="text-sm text-primary-600 hover:text-primary-700">
              Don't have an account? Sign up
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoginForm;