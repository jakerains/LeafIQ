import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!', { 
    VITE_SUPABASE_URL: supabaseUrl ? 'Available' : 'Missing', 
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Available' : 'Missing',
    message: 'Using fallback values - this may cause authentication issues'
  });
}

// Initialize the Supabase client with environment variables
export const supabase = createClient<Database>(
  supabaseUrl || 'https://xaddlctkbrdeigeqfswd.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTYxMzgsImV4cCI6MjA2NDIzMjEzOH0.tgbrIR38y92c8tQAwvJeIbIORozOT4GtagJ2-0BNLPM'
);

// Cannabis Knowledge Response function
export const getCannabisKnowledgeResponse = async (
  query: string, 
  conversationContext: Array<{ role: string; content: string }> = []
) => {
  try {
    const { data, error } = await supabase.functions.invoke('cannabis-knowledge-rag', {
      body: { 
        query,
        conversationContext 
      }
    });

    if (error) {
      console.error('Error calling cannabis-knowledge-rag function:', error);
      return {
        answer: "I'm sorry, I encountered an error while trying to answer. Please try again.",
        contextUsed: false,
        fallback: true
      };
    }

    return data;
  } catch (error) {
    console.error('Error in getCannabisKnowledgeResponse:', error);
    return {
      answer: "I'm sorry, I encountered an error while trying to answer. Please try again.",
      contextUsed: false,
      fallback: true
    };
  }
};

// Terpene Recommendations function
export const getTerpeneRecommendations = async (vibe: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-recommendations', {
      body: { 
        query: vibe,
        type: 'terpene_recommendations'
      }
    });

    if (error) {
      console.error('Error calling ai-recommendations function:', error);
      return {
        recommendations: [],
        effects: [],
        query_analyzed: vibe,
        personalizedMessage: "I'm sorry, I couldn't get recommendations right now. Please try again.",
        contextFactors: []
      };
    }

    return data;
  } catch (error) {
    console.error('Error in getTerpeneRecommendations:', error);
    return {
      recommendations: [],
      effects: [],
      query_analyzed: vibe,
      personalizedMessage: "I'm sorry, I couldn't get recommendations right now. Please try again.",
      contextFactors: []
    };
  }
};

// Log Search Query function
export const logSearchQuery = async (
  query: string,
  searchType: string,
  userId?: string,
  organizationId?: string,
  results?: any[]
) => {
  try {
    // For now, just log to console - you can implement proper logging later
    console.log('Search Query Logged:', {
      query,
      searchType, 
      userId,
      organizationId,
      resultsCount: results?.length || 0,
      timestamp: new Date().toISOString()
    });

    // You could store this in a search_logs table if needed
    // const { error } = await supabase
    //   .from('search_logs')
    //   .insert({
    //     query,
    //     search_type: searchType,
    //     user_id: userId,
    //     organization_id: organizationId,
    //     results_count: results?.length || 0
    //   });
    
    return { success: true };
  } catch (error) {
    console.error('Error logging search query:', error);
    return { success: false, error };
  }
};