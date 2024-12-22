import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hokkweglaumudsmphmbv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhva2t3ZWdsYXVtdWRzbXBobWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzOTUzMDgsImV4cCI6MjA0OTk3MTMwOH0.RnV9oEbUYcTtw--k4G8B2Z4hCmBrpXJwOG_iynBlwas";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false, // This will make the session expire when the browser is closed
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
);