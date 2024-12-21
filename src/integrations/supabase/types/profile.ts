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

export interface ProfilesTable {
  Row: Profile;
  Insert: Omit<Profile, 'created_at' | 'updated_at'>;
  Update: Partial<Profile>;
}