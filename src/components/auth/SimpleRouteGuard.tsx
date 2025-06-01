import React from 'react';
import { useSimpleAuthStore, UserMode } from '../../stores/simpleAuthStore';

interface SimpleRouteGuardProps {
  children: React.ReactNode;
  allowedModes: UserMode[];
  fallbackMessage?: string;
}

export const SimpleRouteGuard: React.FC<SimpleRouteGuardProps> = ({ 
  children, 
  allowedModes, 
  fallbackMessage = "You don't have access to this area." 
}) => {
  const { userMode, dispensaryName, logout } = useSimpleAuthStore();

  // Check if current user mode is allowed
  if (!userMode || !allowedModes.includes(userMode)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">{fallbackMessage}</p>
          
          <div className="text-sm text-gray-500 mb-6">
            Current mode: {userMode || 'None'} <br />
            Required: {allowedModes.join(' or ')}
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return to Kiosk Selection
            </button>
            
            <button 
              onClick={logout}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}; 