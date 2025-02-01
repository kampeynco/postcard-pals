import { CommitteeType } from '../types/enums';

export interface ActBlueAccount {
  id: string;
  user_id: string;
  legal_committee_name: string;
  organization_name?: string;
  committee_type: CommitteeType;
  candidate_first_name?: string;
  candidate_middle_name?: string;
  candidate_last_name?: string;
  candidate_suffix?: string | null;
  office_sought?: string | null;
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