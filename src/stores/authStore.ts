import { create } from 'zustand';
import { AuthState, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string | undefined;
  organizationId?: string;
  role: UserRole;
}

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

interface ExtendedAuthState extends AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  role: null,
  isInitialized: false,
  user: null,
  
  initializeAuth: async () => {
    console.log('Initializing auth...');
    
    try {
      // First check for stored role for passcode login
      const storedRole = localStorage.getItem('leafiqUserRole') as UserRole | null;
      
      // Then check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Found existing Supabase session');
        
        // Fetch user profile to get role and organization
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            id,
            role,
            organization_id
          `)
          .eq('user_id', session.user.id)
          .single();
        
        if (profile) {
          set({ 
            user: {
              id: session.user.id,
              email: session.user.email,
              organizationId: profile.organization_id,
              role: profile.role as UserRole
            },
            role: profile.role as UserRole,
            isInitialized: true
          });
          return;
        }
      }
      
      // If no Supabase session, use stored role
      console.log('Using stored role:', storedRole);
      set({ role: storedRole, isInitialized: true });
      
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isInitialized: true }); // Still mark as initialized to prevent infinite loading
    }
  },
  
  setUser: (user: AuthUser | null) => {
    set({ user, role: user?.role || null });
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
  
  logout: async () => {
    console.log('Logging out');
    // Clear local storage
    localStorage.removeItem('leafiqUserRole');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Reset auth state
    set({ role: null, user: null });
  },
}));