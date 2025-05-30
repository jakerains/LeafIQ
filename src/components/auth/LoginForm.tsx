import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LoginFormProps {
  role: UserRole;
}

const LoginForm = ({ role }: LoginFormProps) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Attempting to login as ${role} with passcode: ${passcode}`);
    const success = login(role, passcode);
    
    if (!success) {
      setError('Invalid passcode. Please try again.');
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
          {role === 'staff' ? 'Staff Login' : 'Admin Login'}
        </h2>
        <p className="text-gray-600">
          Enter your passcode to continue
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
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
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <Button type="submit" isFullWidth>
          Login
        </Button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            {role === 'staff' 
              ? 'For demo, use passcode: 1234' 
              : 'For demo, use passcode: admin1234'}
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;