import { CommitteeType } from "./enums";
import { CandidateSuffix, OfficeSought } from "@/components/actblue/types/base";

export interface ActBlueAccount {
  id: string;
  user_id: string;
  legal_committee_name: string;
  organization_name?: string;
  committee_type: CommitteeType;
  candidate_first_name?: string;
  candidate_middle_name?: string;
  candidate_last_name?: string;
  candidate_suffix?: CandidateSuffix | null;
  office_sought?: OfficeSought | null;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  disclaimer_text: string;
  is_created: boolean;
  is_onboarded: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ActBlueAccountsTable = {
  Row: ActBlueAccount;
  Insert: Omit<ActBlueAccount, "id" | "created_at" | "updated_at">;
  Update: Partial<Omit<ActBlueAccount, "id" | "created_at" | "updated_at">>;
};