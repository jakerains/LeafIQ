import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './views/LandingPage';
import AuthLayout from './views/auth/AuthLayout';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import KioskView from './views/kiosk/KioskView';
import StaffView from './views/staff/StaffView';
import AdminView from './views/admin/AdminView';
import AuthGuard from './components/auth/AuthGuard';
import { useAuthStore } from './stores/authStore';
import PricingPage from './views/pricing/PricingPage';
import CheckoutSuccess from './views/checkout/CheckoutSuccess';
import CheckoutCanceled from './views/checkout/CheckoutCanceled';
import SubscriptionDetails from './views/account/SubscriptionDetails';

function App() {
  const { initializeAuth, isInitialized } = useAuthStore();
  
  useEffect(() => {
    // Initialize auth state when app loads
    initializeAuth();
  }, [initializeAuth]);

  // Show loading state while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-gray-900">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline preload="auto">
          <source src="https://vid.lemniq.com/leafiq.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="content-overlay min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signup" element={<RegisterForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/checkout">
            <Route path="success" element={<CheckoutSuccess />} />
            <Route path="canceled" element={<CheckoutCanceled />} />
          </Route>
          <Route path="/kiosk/*" element={<KioskView />} />
          <Route 
            path="/staff/*" 
            element={
              <AuthGuard requiredRole="staff">
                <StaffView />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AuthGuard requiredRole="admin">
                <AdminView />
              </AuthGuard>
            } 
          />
          <Route
            path="/account/subscription"
            element={
              <AuthGuard requiredRole="admin">
                <SubscriptionDetails />
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;