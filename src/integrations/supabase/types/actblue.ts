import { CommitteeType } from './enums';

export interface ActBlueAccount {
  id: string;
  user_id: string;
  committee_name: string;
  committee_type: CommitteeType;
  candidate_name: string | null;
  office_sought: string | null;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  disclaimer_text: string;
  is_created: boolean | null;
  is_onboarded: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface ActBlueAccountsTable {
  Row: ActBlueAccount;
  Insert: Omit<ActBlueAccount, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<ActBlueAccountsTable['Insert']>;
}