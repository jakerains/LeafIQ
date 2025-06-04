import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export type UserMode = 'customer' | 'employee' | 'admin';

interface AuthSession {
  isAuthenticated: boolean;
  dispensaryName: string;
  organizationId: string;
  username: string;
  userMode: UserMode | null;
  isAdmin: boolean;
}

interface SimpleAuthState extends AuthSession {
  // Auth actions
  loginDispensary: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  selectUserMode: (mode: UserMode) => void;
  logout: () => Promise<void>;
  
  // Helper getters
  isCustomerMode: () => boolean;
  isEmployeeMode: () => boolean;
  isAdminMode: () => boolean;
  getDisplayName: () => string;
}

export const useSimpleAuthStore = create<SimpleAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      dispensaryName: '',
      organizationId: '',
      username: '',
      userMode: null,
      isAdmin: false,

      // Authentication methods
      loginDispensary: async (email: string, password: string) => {
        try {
          console.log('Attempting dispensary login for:', email);
          console.log('🔍 DEBUG: Starting loginDispensary function');
          
          // Use Supabase Auth for proper authentication
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (authError || !authData.user) {
            return { success: false, error: authError?.message || 'Invalid email or password' };
          }

          // Get user profile and organization info
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
              id,
              user_id,
              role,
              organization_id,
              organizations!inner (
                id,
                name,
                slug
              )
            `)
            .eq('user_id', authData.user.id)
            .single();

          if (profileError || !profile) {
            return { success: false, error: 'User profile not found' };
          }
          
          console.log('🔍 DEBUG: Profile fetched successfully:', {
            profileId: profile.id,
            organizationId: profile.organization_id,
            orgName: profile.organizations?.name
          });

          // Set authenticated state
          set({
            isAuthenticated: true,
            dispensaryName: profile.organizations.name,
            organizationId: profile.organization_id || '',
            username: authData.user.email || '',
            userMode: null, // Will be selected next
            isAdmin: false
          });

          console.log('🔍 DEBUG: Auth state set with organizationId:', profile.organization_id);
          return { success: true };
          
        } catch (error) {
          console.error('Dispensary login error:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          };
        }
      },



      selectUserMode: (mode: UserMode) => {
        const state = get();
        console.log('🔍 DEBUG: selectUserMode called with mode:', mode);
        console.log('🔍 DEBUG: Current state:', {
          isAuthenticated: state.isAuthenticated,
          organizationId: state.organizationId,
          dispensaryName: state.dispensaryName
        });
        
        if (!state.isAuthenticated) {
          console.warn('Cannot select user mode when not authenticated');
          return;
        }

        // Handle admin mode special case
        if (mode === 'admin') {
          set({ 
            userMode: mode, 
            isAdmin: true 
          }, false, { type: 'selectUserMode/admin' });
          console.log('🔍 DEBUG: Set admin mode, new state:', {
            userMode: mode,
            isAdmin: true,
            organizationId: get().organizationId
          });
        } else {
          set({ 
            userMode: mode, 
            isAdmin: false 
          }, false, { type: 'selectUserMode/regular' });
          console.log('🔍 DEBUG: Set regular mode, new state:', {
            userMode: mode,
            isAdmin: false,
            organizationId: get().organizationId
          });
        }
      },

      logout: async () => {
        // Sign out from Supabase to clear server-side session
        await supabase.auth.signOut();
        
        // Then clear local state
        set({
          isAuthenticated: false,
          dispensaryName: '',
          organizationId: '',
          username: '',
          userMode: null,
          isAdmin: false
        });
      },

      // Helper methods
      isCustomerMode: () => get().userMode === 'customer',
      isEmployeeMode: () => get().userMode === 'employee',
      isAdminMode: () => get().isAdmin && get().userMode === 'admin',

      getDisplayName: () => {
        const state = get();
        if (state.isAdmin) {
          return `Admin: ${state.username}`;
        }
        if (state.userMode === 'customer') {
          return `Customer at ${state.dispensaryName}`;
        }
        if (state.userMode === 'employee') {
          return `Employee at ${state.dispensaryName}`;
        }
        return state.dispensaryName;
      }
    }),
    {
      name: 'simple-auth-storage', // unique name for localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        dispensaryName: state.dispensaryName,
        organizationId: state.organizationId,
        username: state.username,
        userMode: state.userMode,
        isAdmin: state.isAdmin,
      }),
    }
  )
);