import { Database } from './database';

export interface Profile {
  id: string;
  display_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  is_confirmed: boolean | null;
}

export type ProfilesTable = Database['public']['Tables']['profiles'];