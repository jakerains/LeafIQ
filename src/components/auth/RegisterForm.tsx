import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { signUp } from '../../lib/supabase';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.organizationName
      );

      if (error) throw error;

      // Registration successful
      navigate('/admin');
    } catch (err) {
      setError(err.message);
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
          <Building2 className="text-primary-600" size={24} />
        </div>
        <h2 className="text-2xl font-display font-semibold mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600">
          Get started with LeafIQ for your dispensary
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Dispensary Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full pl-10 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your dispensary name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Create a password"
                required
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            isFullWidth
          >
            Create Account
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-primary-600 hover:text-primary-800">
            Sign in
          </a>
        </p>
      </form>
    </motion.div>
  );
};

export default RegisterForm;