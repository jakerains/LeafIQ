import React, { useEffect } from 'react';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import { SimpleLogin } from './SimpleLogin';
import { KioskSelection } from './KioskSelection';

interface SimpleAuthProviderProps {
  children: React.ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const { isAuthenticated, userMode, isInitialized, initializeAuth } = useSimpleAuthStore();

  // Initialize auth state on app startup
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 SimpleAuthProvider: Initializing auth...');
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Initializing LeafIQ</h3>
          <p className="text-gray-600">Restoring your session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  // If authenticated but no mode selected, show kiosk selection
  if (!userMode) {
    return <KioskSelection />;
  }

  // User is authenticated and has selected a mode, show the app
  return <>{children}</>;
}; 