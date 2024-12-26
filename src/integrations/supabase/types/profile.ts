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

export interface ProfileRow extends Profile {}

export interface ProfileInsert extends Omit<Profile, 'id' | 'created_at' | 'updated_at'> {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate extends Partial<ProfileInsert> {}

export interface ProfilesTable {
  Row: ProfileRow;
  Insert: ProfileInsert;
  Update: ProfileUpdate;
}