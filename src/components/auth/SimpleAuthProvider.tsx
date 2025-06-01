import React from 'react';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import { SimpleLogin } from './SimpleLogin';
import { KioskSelection } from './KioskSelection';

interface SimpleAuthProviderProps {
  children: React.ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const { isAuthenticated, userMode } = useSimpleAuthStore();

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