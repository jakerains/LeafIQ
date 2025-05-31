import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, organizationName: string) => {
  console.log(`Signing up with email: ${email}, org: ${organizationName}`);
  
  try {
    // First create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from signup');
    }

    console.log('User created successfully:', authData.user.id);

    // Create organization with slug from name
    const slug = organizationName.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')       // Remove non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple dashes with single dash
      .replace(/^-+/, '')             // Trim dashes from start
      .replace(/-+$/, '');            // Trim dashes from end

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([
        { 
          name: organizationName,
          slug: slug,
          plan: 'free'
        }
      ])
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      throw orgError;
    }

    console.log('Organization created successfully:', orgData.id);

    // Create profile linking user to organization with admin role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          organization_id: orgData.id,
          role: 'admin'
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    console.log('Profile created successfully:', profileData.id);

    return { 
      data: {
        user: authData.user,
        profile: {
          ...profileData,
          organization: orgData
        }
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
  } catch (error) {
    console.error('Error in signIn:', error);
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
 */
export const logSearchQuery = async (query: {
  search_phrase: string;
  user_type: 'kiosk' | 'staff';
  returned_product_ids: string[];
}) => {
  console.log('Logging search query:', query);
  
  try {
    // Check if we have valid Supabase credentials before proceeding
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Skipping search query logging: Supabase credentials not configured');
      return;
    }

    // Attempt to insert the search query
    const { error } = await supabase
      .from('search_queries')
      .insert([
        {
          search_phrase: query.search_phrase,
          user_type: query.user_type,
          returned_product_ids: query.returned_product_ids,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) {
      // If error is 404 (Not Found), it means the table doesn't exist
      if (error.code === '404' || error.message?.includes('404') || error.message?.includes('not found')) {
        console.warn(
          'The search_queries table does not exist in your Supabase database. ' +
          'Please create it with the appropriate schema. See function comments for details.'
        );
      } else {
        console.error('Error logging search query:', error);
      }
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