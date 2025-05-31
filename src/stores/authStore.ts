import { create } from 'zustand';
import { AuthState, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string | undefined;
  organizationId?: string;
  role: UserRole;
}

interface UserProfile {
  id: string;
  user_id: string;
  organization_id: string;
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
  profile: UserProfile | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  role: null,
  isInitialized: false,
  user: null,
  profile: null,
  
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
            profile,
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
    // When setting the user, also update the profile with organization_id
    if (user) {
      const profile: UserProfile = {
        id: 'profile-' + user.id, // Generate a profile ID
        user_id: user.id,
        organization_id: user.organizationId || 'd85af8c9-0d4a-451c-bc25-8c669c71142e', // Default org ID if none provided
        role: user.role
      };
      set({ user, profile, role: user.role });
    } else {
      set({ user: null, profile: null, role: null });
    }
  },
  
  login: (role: UserRole, passcode: string) => {
    console.log(`Login attempt as ${role}`);
    if (!validatePasscode(role, passcode)) {
      console.log('Login failed: invalid passcode');
      return false;
    }
    
    console.log(`Login successful as ${role}`);
    localStorage.setItem('leafiqUserRole', role as string);
    
    // Create a demo profile with the default organization ID
    const demoUser: AuthUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@example.com',
      organizationId: 'd85af8c9-0d4a-451c-bc25-8c669c71142e', // Default True North org ID
      role
    };
    
    const demoProfile: UserProfile = {
      id: 'profile-' + demoUser.id,
      user_id: demoUser.id,
      organization_id: demoUser.organizationId,
      role
    };
    
    set({ role, user: demoUser, profile: demoProfile });
    return true;
  },
  
  logout: async () => {
    console.log('Logging out');
    // Clear local storage
    localStorage.removeItem('leafiqUserRole');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Reset auth state
    set({ role: null, user: null, profile: null });
  },
}));