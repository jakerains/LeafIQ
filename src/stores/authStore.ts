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

interface ExtendedAuthState extends AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  setUser: (user: AuthUser | null) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, organizationName: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<ExtendedAuthState>((set, get) => ({
  role: null,
  isInitialized: false,
  user: null,
  profile: null,
  
  initializeAuth: async () => {
    console.log('Initializing auth...');
    
    try {
      // Check for existing Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Found existing Supabase session');
        
        // Fetch user profile to get role and organization
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
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
      
      // No session found
      set({ role: null, user: null, profile: null, isInitialized: true });
      
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ role: null, user: null, profile: null, isInitialized: true });
    }
  },
  
  setUser: (user: AuthUser | null) => {
    if (user) {
      const profile: UserProfile = {
        id: 'profile-' + user.id,
        user_id: user.id,
        organization_id: user.organizationId || '',
        role: user.role
      };
      set({ user, profile, role: user.role });
    } else {
      set({ user: null, profile: null, role: null });
    }
  },
  
  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            role,
            organization_id
          `)
          .eq('user_id', data.user.id)
          .single();
        
        if (profile) {
          set({
            profile,
            user: {
              id: data.user.id,
              email: data.user.email,
              organizationId: profile.organization_id,
              role: profile.role as UserRole
            },
            role: profile.role as UserRole
          });
          
          return { success: true };
        } else {
          return { success: false, error: 'User profile not found' };
        }
      }
      
      return { success: false, error: 'Unknown error occurred' };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
  
  signUpWithEmail: async (email: string, password: string, organizationName: string) => {
    try {
      // First create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        let orgId: string;
        
        // Check if this is the demo email - if so, assign to demo organization
        if (email.toLowerCase() === 'demo@leafiq.com') {
          orgId = 'd85af8c9-0d4a-451c-bc25-8c669c71142e'; // Demo organization ID
        } else {
          // Create new organization for regular users
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: organizationName,
              slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              plan: 'trial'
            })
            .select()
            .single();
          
          if (orgError) {
            return { success: false, error: `Failed to create organization: ${orgError.message}` };
          }
          
          orgId = orgData.id;
        }
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            organization_id: orgId,
            role: 'admin'
          });
        
        if (profileError) {
          return { success: false, error: `Failed to create profile: ${profileError.message}` };
        }
        
        // Set the user state
        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            organizationId: orgId,
            role: 'admin'
          },
          profile: {
            id: 'profile-' + data.user.id,
            user_id: data.user.id,
            organization_id: orgId,
            role: 'admin'
          },
          role: 'admin'
        });
        
        return { success: true };
      }
      
      return { success: false, error: 'Failed to create user account' };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
  
  logout: async () => {
    console.log('Logging out');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Reset auth state
    set({ role: null, user: null, profile: null });
  },
}));