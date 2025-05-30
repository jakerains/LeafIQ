import { create } from 'zustand';
import { AuthState, UserRole } from '../types';

// In a real app, this would validate against a server
const validatePasscode = (role: UserRole, passcode: string): boolean => {
  console.log(`Validating ${role} with passcode: ${passcode}`);
  if (role === 'staff' && passcode === '1234') {
    return true;
  }
  if (role === 'admin' && passcode === 'admin1234') {
    return true;
  }
  return false;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  role: null,
  isInitialized: false,
  
  initializeAuth: () => {
    const storedRole = localStorage.getItem('leafiqUserRole') as UserRole | null;
    console.log('Initializing auth, stored role:', storedRole);
    set({ role: storedRole, isInitialized: true });
  },
  
  login: (role: UserRole, passcode: string) => {
    console.log(`Login attempt as ${role}`);
    if (!validatePasscode(role, passcode)) {
      console.log('Login failed: invalid passcode');
      return false;
    }
    
    console.log(`Login successful as ${role}`);
    localStorage.setItem('leafiqUserRole', role as string);
    set({ role });
    return true;
  },
  
  logout: () => {
    console.log('Logging out');
    localStorage.removeItem('leafiqUserRole');
    set({ role: null });
  },
}));