import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { signIn } from '../../lib/supabase';

interface LoginFormProps {
  role?: UserRole;
}

const LoginForm = ({ role }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in the auth layout or in a protected route
  const isAuthLayout = location.pathname.startsWith('/auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isAuthLayout) {
        // Email/password login
        const { data, error: signInError } = await signIn(email, password);
        
        if (signInError) throw signInError;
        
        console.log("Login successful:", data);
        
        // Store user data in auth store
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            organizationId: data.profile?.organization_id,
            role: data.profile?.role || 'admin'
          });
        }
        
        // Navigate to admin dashboard on successful login
        navigate('/admin');
      } else {
        // Passcode login for staff/admin
        if (!role) return;
        
        console.log(`Attempting to login as ${role} with passcode: ${passcode}`);
        const success = login(role, passcode);
        
        if (!success) {
          throw new Error('Invalid passcode. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="mx-auto bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
          <Lock className="text-primary-600" size={24} />
        </div>
        <h2 className="text-2xl font-display font-semibold mb-2">
          {isAuthLayout ? 'Welcome Back' : role === 'staff' ? 'Staff Login' : 'Admin Login'}
        </h2>
        <p className="text-gray-600">
          {isAuthLayout ? 'Sign in to your account' : 'Enter your passcode to continue'}
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {isAuthLayout ? (
          // Email/password login form
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email\" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          // Passcode login form
          <div className="mb-6">
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-1">
              Passcode
            </label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder={role === 'staff' ? 'Enter staff passcode' : 'Enter admin passcode'}
              required
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          isFullWidth 
          isLoading={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
        
        {isAuthLayout ? (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-primary-600 hover:text-primary-800">
                Sign up
              </a>
            </p>
          </div>
        ) : (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {role === 'staff' 
                ? 'For demo, use passcode: 1234' 
                : 'For demo, use passcode: admin1234'}
            </p>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default LoginForm;