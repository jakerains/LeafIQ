import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Check, Monitor, Users, Database, FileUp, Smartphone, HelpCircle } from 'lucide-react';
import Button from '../ui/button';
import { signUp } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  
  // Track current step (1-3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Account & Business Basics
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    locationZipCode: '',
    referralCode: '',
    
    // Step 2: Platform Setup
    useMode: 'both', // 'kiosk', 'staff', or 'both'
    menuSource: 'demo', // 'dutchie', 'jane', 'weedmaps', 'manual', or 'demo'
    enableDemoInventory: true,
    
    // Step 3: Admin Contact & Consent
    fullName: '',
    phoneNumber: '',
    termsAccepted: false,
    onboardingHelp: true
  });
  
  // Form validation and errors
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Step navigation functions
  const goToNextStep = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setError('');
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const goToPreviousStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Step validation
  const validateCurrentStep = () => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.organizationName.trim()) {
        setError('Please enter your dispensary name');
        return false;
      }
      
      if (!formData.email.trim()) {
        setError('Please enter your email address');
        return false;
      }
      
      if (!formData.email.includes('@') || !formData.email.includes('.')) {
        setError('Please enter a valid email address');
        return false;
      }
      
      if (!formData.password) {
        setError('Please create a password');
        return false;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.useMode) {
        setError('Please select how you plan to use LeafIQ');
        return false;
      }
      
      if (!formData.menuSource) {
        setError('Please select your menu source');
        return false;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
      
      if (!formData.termsAccepted) {
        setError('You must accept the Terms of Service');
        return false;
      }
    }
    
    return true;
  };
  
  // Final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
    if (!validateCurrentStep()) return;
    
    setIsLoading(true);
    
    try {
      // Note: Only organizationName, email, and password are actually being sent to the database
      // The other fields would need database schema updates to be persisted
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.organizationName
      );

      if (error) throw error;

      console.log("Registration successful:", data);
      
      // Store user data in auth store
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          organizationId: data.profile?.organization_id,
          role: 'admin'
        });
      }

      // Registration successful
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Common form field styles
  const inputClass = "w-full px-3 py-3 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const checkboxClass = "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5 mr-2";
  const radioClass = "rounded-full border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 mr-2";
  
  // Step 1: Account & Business Basics
  const renderStep1 = () => (
    <>
      <div className="mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Let's get your dispensary set up with LeafIQ
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="organizationName" className={labelClass}>
          Dispensary Name*
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Enter your dispensary name"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className={labelClass}>
          Email Address*
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="password" className={labelClass}>
          Password*
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Create a password"
            required
            minLength={8}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password*
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Confirm your password"
            required
            minLength={8}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="locationZipCode" className={labelClass}>
            Location Zip Code <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="locationZipCode"
            name="locationZipCode"
            value={formData.locationZipCode}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter zip code"
          />
        </div>
        
        <div>
          <label htmlFor="referralCode" className={labelClass}>
            Referral Code <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter referral code"
          />
        </div>
      </div>
    </>
  );
  
  // Step 2: Platform Setup
  const renderStep2 = () => (
    <>
      <div className="mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold mb-2">
            Platform Setup
          </h2>
          <p className="text-gray-600">
            Tell us how you plan to use LeafIQ so we can tailor your setup
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className={labelClass}>
          How will you use LeafIQ?*
        </label>
        <div className="space-y-2 mt-2">
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="useMode"
              value="kiosk"
              checked={formData.useMode === 'kiosk'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Monitor size={18} className="mr-2 text-primary-500" />
                Customer Kiosk
              </div>
              <p className="text-sm text-gray-600 mt-1">Self-service product discovery for customers</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="useMode"
              value="staff"
              checked={formData.useMode === 'staff'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Users size={18} className="mr-2 text-primary-500" />
                Staff Dashboard
              </div>
              <p className="text-sm text-gray-600 mt-1">Tools for your budtenders to assist customers</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="useMode"
              value="both"
              checked={formData.useMode === 'both'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Check size={18} className="mr-2 text-primary-500" />
                Both
              </div>
              <p className="text-sm text-gray-600 mt-1">Full solution for both customers and staff (recommended)</p>
            </div>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <label className={labelClass}>
          Menu Source*
        </label>
        <div className="space-y-2 mt-2">
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="menuSource"
              value="dutchie"
              checked={formData.menuSource === 'dutchie'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Database size={18} className="mr-2 text-primary-500" />
                Dutchie
              </div>
              <p className="text-sm text-gray-600 mt-1">Connect to your Dutchie menu</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="menuSource"
              value="jane"
              checked={formData.menuSource === 'jane'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Database size={18} className="mr-2 text-primary-500" />
                Jane
              </div>
              <p className="text-sm text-gray-600 mt-1">Connect to your Jane menu</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="menuSource"
              value="weedmaps"
              checked={formData.menuSource === 'weedmaps'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Database size={18} className="mr-2 text-primary-500" />
                Weedmaps
              </div>
              <p className="text-sm text-gray-600 mt-1">Connect to your Weedmaps menu</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="menuSource"
              value="manual"
              checked={formData.menuSource === 'manual'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <FileUp size={18} className="mr-2 text-primary-500" />
                Manual Upload
              </div>
              <p className="text-sm text-gray-600 mt-1">Upload your inventory via CSV or JSON</p>
            </div>
          </label>
          
          <label className="flex items-start p-4 bg-white bg-opacity-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-opacity-70 transition-colors">
            <input
              type="radio"
              name="menuSource"
              value="demo"
              checked={formData.menuSource === 'demo'}
              onChange={handleChange}
              className={radioClass}
            />
            <div>
              <div className="font-medium flex items-center">
                <Check size={18} className="mr-2 text-primary-500" />
                Demo Inventory
              </div>
              <p className="text-sm text-gray-600 mt-1">Start with our demo inventory to try the system immediately</p>
            </div>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="enableDemoInventory"
            checked={formData.enableDemoInventory}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span>
            <span className="font-medium">Enable demo inventory</span>
            <p className="text-sm text-gray-600">
              Start with sample products while you set up your own inventory
            </p>
          </span>
        </label>
      </div>
    </>
  );
  
  // Step 3: Admin Contact & Consent
  const renderStep3 = () => (
    <>
      <div className="mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold mb-2">
            Almost There!
          </h2>
          <p className="text-gray-600">
            Just a few more details to complete your setup
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="fullName" className={labelClass}>
          Your Full Name*
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="phoneNumber" className={labelClass}>
          Phone Number <span className="text-gray-400">(optional)</span>
        </label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`${inputClass} pl-10`}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className={checkboxClass}
            required
          />
          <div>
            <span className="font-medium">Terms of Service*</span>
            <p className="text-sm text-gray-600">
              I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </label>
      </div>
      
      <div className="mb-6">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="onboardingHelp"
            checked={formData.onboardingHelp}
            onChange={handleChange}
            className={checkboxClass}
          />
          <div>
            <span className="font-medium">Yes, I'd like onboarding help</span>
            <p className="text-sm text-gray-600">
              Our team will reach out to assist with your setup and answer any questions
            </p>
          </div>
        </label>
      </div>
    </>
  );

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
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div 
                className={`rounded-full h-8 w-8 flex items-center justify-center font-medium text-sm border-2 ${
                  currentStep === step 
                    ? 'border-primary-500 text-primary-500 bg-primary-50' 
                    : currentStep > step 
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {currentStep > step ? <Check size={16} /> : step}
              </div>
              {step < 3 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    currentStep > step ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Render the current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} mt-8`}>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="ghost"
              leftIcon={<ArrowLeft size={16} />}
              onClick={goToPreviousStep}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              rightIcon={<ArrowRight size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-primary-600 hover:text-primary-800">
          Sign in
        </a>
      </p>
      
      {currentStep === 3 && (
        <div className="mt-6 p-3 bg-primary-50 rounded-lg flex items-center text-sm">
          <HelpCircle size={18} className="text-primary-600 mr-2 flex-shrink-0" />
          <p className="text-primary-800">
            Your account is completely free to set up. You can explore all features before subscribing.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RegisterForm;