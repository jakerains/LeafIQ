import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables', { 
    url: supabaseUrl ? 'Available' : 'Missing', 
    key: supabaseAnonKey ? 'Available' : 'Missing'
  });
}

// Initialize the Supabase client with environment variables
export const supabase = createClient<Database>(
  supabaseUrl || 'https://xaddlctkbrdeigeqfswd.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGRsY3RrYnJkZWlnZXFmc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3ODEwNTcsImV4cCI6MjAzNDM1NzA1N30.FX4kDdV1s2DKvB0rqMSJ5A0fLUkADp9TpwU-M1KU3vo'
);