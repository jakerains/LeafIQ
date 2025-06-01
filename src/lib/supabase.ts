import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for the entire app with custom fetch options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'leafiq-web'
    }
  }
});

// Authentication functions
export const signUp = async (
  email: string, 
  password: string, 
  organizationName: string,
  additionalData?: {
    useMode?: 'kiosk' | 'staff' | 'both';
    menuSource?: 'dutchie' | 'jane' | 'weedmaps' | 'manual';
    enableDemoInventory?: boolean;
    locationZip?: string;
    referralCode?: string;
    fullName?: string;
    phoneNumber?: string;
    wantOnboardingHelp?: boolean;
  }
) => {
  console.log(`Signing up with email: ${email}, org: ${organizationName}`, additionalData);
  
  try {
    // Create organization slug from name
    const slug = organizationName.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')       // Remove non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple dashes with single dash
      .replace(/^-+/, '')             // Trim dashes from start
      .replace(/-+$/, '');            // Trim dashes from end

    // Pass organization data in metadata for the trigger
    const userMetadata = {
      organization: organizationName,
      slug: slug,
      role: 'admin',
      ...additionalData
    };

    // Sign up with metadata for the trigger function
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from signup');
    }

    console.log('User created successfully:', authData.user.id);

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to fetch the created profile with organization data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        organizations (*)
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile (non-fatal):', profileError);
      // Don't throw here - the user was created successfully
      // The profile fetch might fail due to RLS policies but the user can still login
    } else {
      console.log('Profile fetched successfully:', profile);
    }

    return { 
      data: {
        user: authData.user,
        profile: profile || null
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  console.log(`Signing in with email: ${email}`);
  
  try {
    // Add error handling for empty credentials
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    // Fetch user's profile and organization data
    if (data.user) {
      console.log('User authenticated successfully:', data.user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        console.log('Profile fetched successfully:', profile);
      }

      return { data: { ...data, profile }, error: null };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error in signIn:', error);
    // Improve error message for network issues
    if (error.message === 'Failed to fetch') {
      return { 
        data: null, 
        error: new Error('Unable to connect to authentication service. Please check your internet connection and try again.') 
      };
    }
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error };
  }
};

// Function to call the AI recommendation edge function
export const getAIRecommendations = async (vibe: string) => {
  console.log('Calling AI recommendations for vibe:', vibe);
  
  try {
    // Make the actual API call to Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-recommendations', {
      body: { vibe }
    });

    if (error) {
      console.error('Error calling AI recommendation function:', error);
      throw new Error(error.message);
    }

    console.log('AI recommendations received:', data);
    return data;
  } catch (err) {
    console.error('Failed to get AI recommendations:', err);
    // Return null to allow fallback to local recommendation engine
    return null;
  }
};

/**
 * Function to log search queries to Supabase
 * 
 * NOTE: This function requires a 'search_queries' table to be created in your Supabase database
 * with the following structure:
 * - id: uuid (Primary Key, default value: gen_random_uuid())
 * - search_phrase: text
 * - user_type: text
 * - returned_product_ids: text[] (array of text)
 * - timestamp: timestamp with time zone (default value: now())
 * - organization_id: uuid (foreign key to organizations table)
 */
export const logSearchQuery = async (query: {
  search_phrase: string;
  user_type: 'kiosk' | 'staff';
  returned_product_ids: string[];
  organization_id?: string;
}) => {
  console.log('Logging search query:', query);
  
  try {
    // Check if we have valid Supabase credentials before proceeding
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Skipping search query logging: Supabase credentials not configured');
      return;
    }

    // Use default organization ID if none provided
    const organization_id = query.organization_id || 'd85af8c9-0d4a-451c-bc25-8c669c71142e';

    // Attempt to insert the search query
    const { error } = await supabase
      .from('search_queries')
      .insert([
        {
          search_phrase: query.search_phrase,
          user_type: query.user_type,
          returned_product_ids: query.returned_product_ids,
          timestamp: new Date().toISOString(),
          organization_id: organization_id
        }
      ]);

    if (error) {
      // Log the error but don't throw it to prevent breaking the app flow
      console.error('Error logging search query:', error.message);
    }
  } catch (err) {
    console.error('Failed to log search query:', err);
    // Gracefully continue execution even if logging fails
  }
};

// Get the current authenticated user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const { user, error } = await getCurrentUser();
  return { isAuthenticated: !!user, user, error };
};