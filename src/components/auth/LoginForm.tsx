import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Eye, EyeOff, UserPlus, Coffee } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  role?: UserRole;
}

const LoginForm = ({ role: requiredRole }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithEmail } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get role from URL parameter
  const roleFromUrl = searchParams.get('role') as UserRole | null;
  const displayRole = roleFromUrl || requiredRole;
  
  useEffect(() => {
    // Pre-fill demo credentials based on role
    if (roleFromUrl === 'staff') {
      setEmail('staff@leafiq.online');
      setPassword('staff1234');
    } else if (roleFromUrl === 'admin') {
      setEmail('demo@leafiq.online');
      setPassword('demo1234');
    }
  }, [roleFromUrl]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      // Sign out any existing user first
      await supabase.auth.signOut();
      
      const result = await signInWithEmail(email, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Navigate to appropriate page based on role
      const effectiveRole = displayRole || 'admin';
      const targetPath = `/${effectiveRole}`;
      const from = (location.state as any)?.from?.pathname || targetPath;
      navigate(from, { replace: true });

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@leafiq.online');
    setPassword('demo1234');
    setError('');
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
        <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lock className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-3xl font-display font-semibold mb-2">
          {displayRole ? `${getRoleDisplayName(displayRole)} Login` : 'Sign In'}
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
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

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
              placeholder="Enter your password"
              autoComplete="current-password"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
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

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-3"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <Button
          onClick={handleDemoLogin}
          variant="outline"
          className="w-full py-3 border-primary-200 text-primary-700 hover:bg-primary-50"
        >
          <Coffee className="h-4 w-4 mr-2" />
          Try Demo Account
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigate('/auth/register')}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up here
          </button>
        </div>
      </motion.div>

      {/* Demo Account Info */}
      {displayRole && (
        <div className={`mt-6 p-3 border rounded-lg ${
          displayRole === 'staff' 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start">
            <Coffee className={`h-4 w-4 mr-2 mt-0.5 ${
              displayRole === 'staff' ? 'text-orange-500' : 'text-green-500'
            }`} />
            <div>
              <p className={`text-sm font-medium ${
                displayRole === 'staff' ? 'text-orange-800' : 'text-green-800'
              }`}>
                Demo {getRoleDisplayName(displayRole)} Account
              </p>
              <p className={`text-xs mt-1 ${
                displayRole === 'staff' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {displayRole === 'staff' ? (
                  <>
                    Email: staff@leafiq.online<br />
                    Password: staff1234
                  </>
                ) : (
                  <>
                    Email: demo@leafiq.online<br />
                    Password: demo1234
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;