import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eticfuarcjfjvyytczpm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aWNmdWFyY2pmanZ5eXRjenBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDk4NjUsImV4cCI6MjA1MDgyNTg2NX0.tsRsLRUF6gcuoKy1qEP60A3EzKsMbprl8Jo0j44CFSc";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);