import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './views/LandingPage';

import AuthLayout from './views/auth/AuthLayout';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import KioskView from './views/kiosk/KioskView';
import StaffView from './views/staff/StaffView';
import AdminView from './views/admin/AdminView';
import { SimpleAuthProvider } from './components/auth/SimpleAuthProvider';
import { SimpleRouteGuard } from './components/auth/SimpleRouteGuard';
import { DemoLogin } from './components/auth/DemoLogin';
import { useSimpleAuthStore } from './stores/simpleAuthStore';
import PricingPage from './views/pricing/PricingPage';
import CheckoutSuccess from './views/checkout/CheckoutSuccess';
import CheckoutCanceled from './views/checkout/CheckoutCanceled';
import VersionDisplay from './components/ui/VersionDisplay';
import SuperadminAuth from './components/auth/SuperadminAuth';
import NotFound from './components/ui/NotFound';

// Info Pages
import FeaturesPage from './views/FeaturesPage';
import SecurityPage from './views/SecurityPage';
import AboutPage from './views/AboutPage';
import ContactPage from './views/ContactPage';
import CareersPage from './views/CareersPage';
import PrivacyPage from './views/PrivacyPage';
import TermsPage from './views/TermsPage';
import SupportPage from './views/SupportPage';
import { BlogPage, DocsPage, CompliancePage } from './views/ComingSoonPage';

// Component to redirect based on selected user mode
const ModeBasedRedirect = () => {
  const { userMode } = useSimpleAuthStore();
  
  console.log('🔄 ModeBasedRedirect: Current userMode =', userMode);
  
  // Redirect based on selected mode
  if (userMode === 'customer') {
    console.log('   → Redirecting to /app/kiosk');
    return <Navigate to="/app/kiosk" replace />;
  } else if (userMode === 'employee') {
    console.log('   → Redirecting to /app/staff');
    return <Navigate to="/app/staff" replace />;
  } else if (userMode === 'admin') {
    console.log('   → Redirecting to /app/admin');
    return <Navigate to="/app/admin" replace />;
  }
  
  // Default to kiosk if no mode is set (shouldn't happen due to SimpleAuthProvider)
  console.log('   → Defaulting to /app/kiosk');
  return <Navigate to="/app/kiosk" replace />;
};

function App() {
  const location = useLocation();

  // Determine version display position based on current route
  const getVersionPosition = () => {
    if (location.pathname.startsWith('/kiosk')) return 'top-right';
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')) return 'bottom-left';
    return 'bottom-right';
  };

  // Determine if we should show version display (hide on auth pages for cleaner look)
  const shouldShowVersion = !location.pathname.startsWith('/auth') && !location.pathname.startsWith('/superadmin');

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

          {/* Superadmin Route - Direct access, no dispensary authentication */}
          <Route path="/superadmin/*" element={<SuperadminAuth />} />

          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Info Pages */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signup" element={<RegisterForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/checkout">
            <Route path="success" element={<CheckoutSuccess />} />
            <Route path="canceled" element={<CheckoutCanceled />} />
          </Route>
          
          {/* New Simplified Auth Flow */}
          <Route 
            path="/kiosk/*" 
            element={
              <SimpleAuthProvider>
                <SimpleRouteGuard allowedModes={['customer', 'employee', 'admin']}>
                  <KioskView />
                </SimpleRouteGuard>
              </SimpleAuthProvider>
            } 
          />
          <Route 
            path="/staff/*" 
            element={
              <SimpleAuthProvider>
                <SimpleRouteGuard allowedModes={['customer', 'employee', 'admin']}>
                  <StaffView />
                </SimpleRouteGuard>
              </SimpleAuthProvider>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <SimpleAuthProvider>
                <SimpleRouteGuard allowedModes={['admin']}>
                  <AdminView />
                </SimpleRouteGuard>
              </SimpleAuthProvider>
            } 
          />
          
          {/* Simple Auth Flow Entry Point */}
          <Route 
            path="/app/*" 
            element={
              <SimpleAuthProvider>
                <Routes>
                  <Route path="kiosk/*" element={
                    <SimpleRouteGuard allowedModes={['customer', 'employee', 'admin']}>
                      <KioskView />
                    </SimpleRouteGuard>
                  } />
                  <Route path="staff/*" element={
                    <SimpleRouteGuard allowedModes={['customer', 'employee', 'admin']}>
                      <StaffView />
                    </SimpleRouteGuard>
                  } />
                  <Route path="admin/*" element={
                    <SimpleRouteGuard allowedModes={['admin']}>
                      <AdminView />
                    </SimpleRouteGuard>
                  } />
                  <Route index element={<ModeBasedRedirect />} />
                </Routes>
              </SimpleAuthProvider>
            } 
          />
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Version Display - Positioned based on current route */}
        {shouldShowVersion && (
          <VersionDisplay 
            position={getVersionPosition()} 
            variant="minimal"
          />
        )}
      </div>
    </div>
  );
}

export default App;