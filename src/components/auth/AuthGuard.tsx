import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { role, isInitialized, user } = useAuthStore();
  
  console.log(`AuthGuard checking - Required: ${requiredRole}, Current: ${role}, Initialized: ${isInitialized}`);
  console.log('User info:', user);
  
  // If auth hasn't initialized yet, show a loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-primary-600">Loading...</div>
      </div>
    );
  }
  
  // If user isn't authenticated or doesn't have the required role
  if (!role || role !== requiredRole) {
    // If trying to access admin area but only have staff role
    if (requiredRole === 'admin' && role === 'staff') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-display font-semibold mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-6">You need admin access to view this area.</p>
            <button 
              onClick={() => window.location.href = '/staff'} 
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              Return to Staff Area
            </button>
          </div>
        </div>
      );
    }
    
    // Standard login form
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <LoginForm role={requiredRole} />
      </div>
    );
  }
  
  // User is authenticated with the correct role
  return <>{children}</>;
};

export default AuthGuard;