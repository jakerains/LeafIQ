import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Building2, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Check, Monitor, Users, Database, MapPin, Gift, Phone, User, HelpCircle, Download, FileJson, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface FormData {
  // Step 1: Account & Business Basics
  dispensaryName: string;
  email: string;
  password: string;
  confirmPassword: string;
  locationZip: string;
  referralCode: string;
  
  // Step 2: Platform Setup
  useMode: 'kiosk' | 'staff' | 'both';
  menuSource: 'dutchie' | 'jane' | 'weedmaps' | 'manual';
  enableDemoInventory: boolean;
  
  // Step 3: Admin Contact & Consent
  fullName: string;
  phoneNumber: string;
  acceptTerms: boolean;
  wantOnboardingHelp: boolean;
}

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    dispensaryName: '',
    email: '',
    password: '',
    confirmPassword: '',
    locationZip: '',
    referralCode: '',
    useMode: 'both',
    menuSource: 'manual',
    enableDemoInventory: true,
    fullName: '',
    phoneNumber: '',
    acceptTerms: false,
    wantOnboardingHelp: true
  });
  
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithEmail } = useAuthStore();
  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.dispensaryName.trim()) newErrors.dispensaryName = 'Dispensary name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
        
      case 2:
        // No required fields in step 2, but validate selections
        if (!formData.useMode) newErrors.useMode = 'Please select how you plan to use LeafIQ';
        if (!formData.menuSource) newErrors.menuSource = 'Please select your menu source';
        break;
        
      case 3:
        if (!formData.fullName.trim()) newErrors.fullName = 'Your full name is required';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the Terms of Service';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    
    try {
      // Use the signUpWithEmail method from the auth store
      const signUpResult = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.dispensaryName
      );
      
      if (!signUpResult.success) {
        console.error('Registration error:', signUpResult.error);
        setErrors({ email: signUpResult.error || 'Registration failed' });
        setIsLoading(false);
        return;
      }

      // Registration successful - sign in the user automatically
      const signInResult = await signInWithEmail(formData.email, formData.password);
      
      if (!signInResult.success) {
        console.error('Auto sign-in failed:', signInResult.error);
        // If auto sign-in fails, redirect to login
        navigate('/auth/login?registered=true');
        return;
      }
      
      // Check if user wants onboarding
      if (formData.wantOnboardingHelp) {
        // Navigate to onboarding flow
        navigate('/admin/onboarding', { 
          state: { 
            fromRegistration: true,
            enableDemoInventory: formData.enableDemoInventory,
            menuSource: formData.menuSource
          } 
        });
      } else if (formData.enableDemoInventory) {
        // If they want demo inventory but no onboarding, go to import
        navigate('/admin/inventory/import', { 
          state: { 
            fromRegistration: true,
            loadDemoData: true 
          } 
        });
      } else {
        // Otherwise go to dashboard
        navigate('/admin');
      }
      
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrors({ email: error instanceof Error ? error.message : 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/inventory-upload-template.json';
    link.download = 'leafiq-inventory-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Building2 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Account & Business Basics</h3>
              <p className="text-gray-600">Let's get your dispensary set up on LeafIQ</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispensary Name *
              </label>
              <input
                type="text"
                value={formData.dispensaryName}
                onChange={(e) => updateFormData('dispensaryName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.dispensaryName ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Green Valley Dispensary"
              />
              {errors.dispensaryName && (
                <p className="text-red-600 text-sm mt-1">{errors.dispensaryName}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Used to label your dashboard and customer-facing screens</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="admin@greenvalley.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Primary login and communication contact</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="8+ characters"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Zip Code <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.locationZip}
                    onChange={(e) => updateFormData('locationZip', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="90210"
                    maxLength={5}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Seed regional inventory examples</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => updateFormData('referralCode', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="PARTNER123"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Affiliate/referral tracking</p>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Settings className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Platform Setup</h3>
              <p className="text-gray-600">Tell us how you plan to use LeafIQ so we can tailor your setup</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Use Mode *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'kiosk', label: 'Customer Kiosk', icon: Monitor },
                  { value: 'staff', label: 'Staff Dashboard', icon: Users },
                  { value: 'both', label: 'Both', icon: Database }
                ] as const).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateFormData('useMode', value)}
                    className={`p-4 border rounded-xl text-sm font-medium transition-all flex flex-col items-center space-y-2 ${
                      formData.useMode === value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              {errors.useMode && (
                <p className="text-red-600 text-sm mt-1">{errors.useMode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Menu Source *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'dutchie', label: 'Dutchie' },
                  { value: 'jane', label: 'Jane' },
                  { value: 'weedmaps', label: 'Weedmaps' },
                  { value: 'manual', label: 'Manual Upload (CSV/JSON)' }
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateFormData('menuSource', value)}
                    className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                      formData.menuSource === value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.menuSource && (
                <p className="text-red-600 text-sm mt-1">{errors.menuSource}</p>
              )}
            </div>

            {/* Show template download button when manual upload is selected */}
            {formData.menuSource === 'manual' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 p-4 rounded-xl"
              >
                <div className="flex items-start space-x-3">
                  <FileJson className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Inventory Template Available</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Download our JSON template to prepare your inventory for import. The template includes 
                      examples for all product types with terpene profiles.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 text-primary-600 border-primary-200 bg-primary-50"
                      onClick={handleDownloadTemplate}
                    >
                      <Download size={14} />
                      Download JSON Template
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableDemoInventory}
                  onChange={(e) => updateFormData('enableDemoInventory', e.target.checked)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Enable Demo Inventory</div>
                  <div className="text-sm text-gray-500 mt-1">Load demo strains with terpene data and effect categories to showcase functionality</div>
                </div>
              </label>
            </div>

            {formData.enableDemoInventory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-primary-50 p-4 rounded-xl"
              >
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary-900">Demo Preview</h4>
                    <p className="text-sm text-primary-700 mt-1">
                      We'll populate your dashboard with ~50 sample strains including popular options like 
                      Blue Dream, OG Kush, and Girl Scout Cookies with full terpene profiles and effects.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <User className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Admin Contact & Consent</h3>
              <p className="text-gray-600">Final details to complete your setup</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="John Smith"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Used for admin identification</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">For optional onboarding or live setup support</p>
            </div>

            <div className="space-y-4">
              <label className={`flex items-start space-x-3 p-4 border rounded-xl transition-colors cursor-pointer ${
                errors.acceptTerms ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateFormData('acceptTerms', e.target.checked)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center">
                    <FileJson className="h-4 w-4 mr-2" />
                    Accept Terms of Service *
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantOnboardingHelp}
                  onChange={(e) => updateFormData('wantOnboardingHelp', e.target.checked)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Yes, I'd like onboarding help
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Get a guided intro and AI assistant to help you set up LeafIQ for your dispensary
                  </div>
                </div>
              </label>
            </div>

            {errors.acceptTerms && (
              <p className="text-red-600 text-sm">{errors.acceptTerms}</p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-lg w-full">
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-semibold mb-2">Join LeafIQ</h2>
        <p className="text-gray-600">Transform your dispensary experience in 3 simple steps</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 < currentStep
                  ? 'bg-primary-600 text-white'
                  : i + 1 === currentStep
                  ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1 < currentStep ? <Check className="h-5 w-5" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  i + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <Check className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Error display */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Please fix the errors above to continue</span>
        </motion.div>
      )}

      <div className="text-center mt-6">
        <a href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700">
          Already have an account? Sign in
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;