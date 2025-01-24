export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone_number: string | null;
  role: string | null;
  is_confirmed: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfilesTable {
  Row: Profile;
  Insert: Profile;
  Update: Partial<Profile>;
}