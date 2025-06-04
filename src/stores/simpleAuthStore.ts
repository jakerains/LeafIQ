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
  // Auth state
  isInitialized: boolean;
  
  // Auth actions
  initializeAuth: () => Promise<void>;
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
      isInitialized: false,
      dispensaryName: '',
      organizationId: '',
      username: '',
      userMode: null,
      isAdmin: false,

      // Initialize authentication state from Supabase session
      initializeAuth: async () => {
        console.log('🔧 Initializing auth state...');
        
        try {
          // Check for existing Supabase session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session check error:', error);
            set({ isInitialized: true });
            return;
          }
          
          if (session?.user) {
            console.log('✅ Found existing session for:', session.user.email);
            
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
              .eq('user_id', session.user.id)
              .single();

            if (profileError || !profile) {
              console.error('Profile fetch error:', profileError);
              // Clear invalid session
              await supabase.auth.signOut();
              set({ 
                isAuthenticated: false,
                isInitialized: true,
                dispensaryName: '',
                organizationId: '',
                username: '',
                userMode: null,
                isAdmin: false
              });
              return;
            }
            
            console.log('✅ Profile restored:', {
              organizationId: profile.organization_id,
              orgName: profile.organizations?.name,
              role: profile.role
            });

            // Restore authenticated state
            set({
              isAuthenticated: true,
              isInitialized: true,
              dispensaryName: profile.organizations.name,
              organizationId: profile.organization_id || '',
              username: session.user.email || '',
              // Keep existing userMode from localStorage if available
              // isAdmin and userMode will be restored from persisted state
            });
            
            console.log('✅ Auth state restored successfully');
          } else {
            console.log('❌ No existing session found');
            set({ 
              isAuthenticated: false,
              isInitialized: true,
              dispensaryName: '',
              organizationId: '',
              username: '',
              userMode: null,
              isAdmin: false
            });
          }
          
          // Set up auth state change listener for real-time updates
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state change event:', event);
            
            if (event === 'SIGNED_OUT' || !session) {
              console.log('🚪 User signed out');
              set({
                isAuthenticated: false,
                dispensaryName: '',
                organizationId: '',
                username: '',
                userMode: null,
                isAdmin: false
              });
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              console.log('🔄 Session updated, refreshing profile...');
              
              // Refresh user profile on session changes
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
                .eq('user_id', session.user.id)
                .single();

              if (profile && !profileError) {
                const currentState = get();
                set({
                  isAuthenticated: true,
                  dispensaryName: profile.organizations.name,
                  organizationId: profile.organization_id || '',
                  username: session.user.email || '',
                  // Preserve userMode if already set
                  userMode: currentState.userMode,
                  isAdmin: currentState.isAdmin
                });
                console.log('✅ Profile refreshed successfully');
              }
            }
          });
          
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isInitialized: true });
        }
      },

      // Authentication methods
      loginDispensary: async (email: string, password: string) => {
        try {
          console.log('Attempting dispensary login for:', email);
          
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
          
          console.log('✅ Login successful:', {
            profileId: profile.id,
            organizationId: profile.organization_id,
            orgName: profile.organizations?.name
          });

          // Set authenticated state
          set({
            isAuthenticated: true,
            isInitialized: true,
            dispensaryName: profile.organizations.name,
            organizationId: profile.organization_id || '',
            username: authData.user.email || '',
            userMode: null, // Will be selected next
            isAdmin: false
          });

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
        console.log('🔍 Selecting user mode:', mode);
        
        if (!state.isAuthenticated) {
          console.warn('Cannot select user mode when not authenticated');
          return;
        }

        // Handle admin mode special case
        if (mode === 'admin') {
          set({ 
            userMode: mode, 
            isAdmin: true 
          });
        } else {
          set({ 
            userMode: mode, 
            isAdmin: false 
          });
        }
        
        console.log('✅ User mode set to:', mode);
      },

      logout: async () => {
        console.log('🚪 Logging out...');
        
        try {
          // Sign out from Supabase to clear server-side session
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        // Clear local state (auth state change listener will also handle this)
        set({
          isAuthenticated: false,
          isInitialized: true,
          dispensaryName: '',
          organizationId: '',
          username: '',
          userMode: null,
          isAdmin: false
        });
        
        console.log('✅ Logged out successfully');
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
      name: 'simple-auth-storage',
      partialize: (state) => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
        dispensaryName: state.dispensaryName,
        organizationId: state.organizationId,
        username: state.username,
        userMode: state.userMode,
        isAdmin: state.isAdmin,
        // Don't persist isInitialized - should always start false
      }),
    }
  )
);