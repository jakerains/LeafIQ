import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Building2, Users } from 'lucide-react';
import { signIn } from '../../lib/supabase';

interface LoginFormProps {
  role?: UserRole;
}

const LoginForm = ({ role: requiredRole }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  const { login, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSupabaseLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Check if profile exists in the data
        const profile = (data as any)?.profile;
        
        if (profile) {
          // Set user in auth store
          setUser({
            id: data.user.id,
            email: data.user.email,
            organizationId: profile.organization_id,
            role: profile.role as UserRole
          });

          // If this login is for a specific role requirement, check if user has access
          if (requiredRole && profile.role !== requiredRole) {
            if (requiredRole === 'admin' && profile.role === 'staff') {
              setError('You need administrator access for this area. Please contact your admin.');
            } else {
              setError(`Access denied. Required role: ${requiredRole}`);
            }
            setIsLoading(false);
            return;
          }

          // Navigate to appropriate dashboard
          const targetRole = requiredRole || profile.role;
          const from = (location.state as any)?.from?.pathname || `/${targetRole}`;
          navigate(from, { replace: true });
        } else {
          setError('Login successful but no profile found. Please contact support.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSwitch = (selectedRole: UserRole) => {
    if (!selectedRole) return;
    
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(selectedRole, passcode);
      if (success) {
        setShowRoleSelector(false);
        const from = (location.state as any)?.from?.pathname || `/${selectedRole}`;
        navigate(from, { replace: true });
      } else {
        setError('Invalid access code. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'staff': return 'Staff Member';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  if (showRoleSelector) {
    return (
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-semibold mb-2">Quick Role Access</h2>
          <p className="text-gray-600">
            Use this for demo/testing purposes only
          </p>
        </div>

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
                    handleRoleSwitch(requiredRole);
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
              onClick={() => handleRoleSwitch(requiredRole)}
              disabled={isLoading || !passcode}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Signing In...' : `Sign In as ${getRoleDisplayName(requiredRole)}`}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={() => handleRoleSwitch('staff')}
                disabled={isLoading || !passcode}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Staff'}
              </Button>
              <Button
                onClick={() => handleRoleSwitch('admin')}
                disabled={isLoading || !passcode}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowRoleSelector(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to account login
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Demo codes: Staff (1234) | Admin (admin1234)</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full">
      <div className="text-center mb-8">
        <Building2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-display font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-600">
          Sign in to your dispensary account
        </p>
        {requiredRole && (
          <p className="text-sm text-primary-600 mt-2">
            {getRoleDisplayName(requiredRole)} access required
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSupabaseLogin();
                }
              }}
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSupabaseLogin();
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

        <Button
          onClick={handleSupabaseLogin}
          disabled={isLoading || !email || !password}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="space-y-3">
          <div className="text-center">
            <a href="/auth/signup" className="text-sm text-primary-600 hover:text-primary-700">
              Don't have an account? Sign up
            </a>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowRoleSelector(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Demo/Testing Access →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;