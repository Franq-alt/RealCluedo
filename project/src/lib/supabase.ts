import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase.co');
  } catch {
    return false;
  }
}

// Check if environment variables are properly configured
const hasValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'https://your-project-ref.supabase.co' &&
                      supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key-here' &&
                      !supabaseUrl.includes('your-project-ref') &&
                      !supabaseAnonKey.includes('your-actual-anon-key-here') &&
                      isValidUrl(supabaseUrl) &&
                      supabaseAnonKey.startsWith('eyJ');

if (!hasValidConfig) {
  console.warn('⚠️ Supabase not configured properly!');
  console.warn('Please update your .env file with valid Supabase credentials.');
  console.warn('Current URL:', supabaseUrl);
  console.warn('Current Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not set');
}

// Use valid defaults that won't cause URL constructor to fail
const defaultUrl = hasValidConfig ? supabaseUrl : 'https://placeholder.supabase.co';
const defaultKey = hasValidConfig ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3NzEyMDAuImV4cCI6MTk2NTM0NzIwMH0.placeholder';

export const supabase = createClient<Database>(defaultUrl, defaultKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'real-cluedo-game'
    }
  }
});

// Export configuration status for components to check
export const isSupabaseConfigured = () => hasValidConfig;

// Only test connection if we have real credentials
if (hasValidConfig) {
  // Test connection on initialization
  supabase
    .from('leaderboard')
    .select('count')
    .limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('❌ Supabase connection test failed:', error.message);
      } else {
        console.log('✅ Supabase connection successful');
      }
    })
    .catch((error) => {
      console.error('❌ Supabase connection error:', error.message);
    });
} else {
  console.warn('⏭️ Skipping Supabase connection test - credentials not configured');
}