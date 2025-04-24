import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase URL and anon key to ensure they're available
const supabaseUrl = 'https://xclbkyukcfrorostuzaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbGJreXVrY2Zyb3Jvc3R1emF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjU4MjEsImV4cCI6MjA2MDkwMTgyMX0.OEjyLgdY5UhTLeBQsG6WGcdB6vXTj2rglW-eF18zTak';

console.log('Initializing Supabase client with:', { supabaseUrl, supabaseAnonKey });

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'voxify-auth-token',
    storage: window.localStorage
  }
});

console.log('Supabase client initialized');

export default supabase;
