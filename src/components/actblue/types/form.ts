export type CandidateSuffix = "Jr." | "Sr." | "II" | "III" | "IV" | "V";

export type OfficeSought = 
  | "U.S. President"
  | "U.S. Senator"
  | "U.S. Representative"
  | "Governor"
  | "Lieutenant Governor"
  | "State Senator"
  | "State Representative"
  | "Attorney General"
  | "Secretary of State"
  | "School Board Member";

export type CommitteeType = "candidate" | "political_action_committee" | "non_profit";

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ActBlueFormData {
  committee_type?: CommitteeType;
  legal_committee_name?: string;
  organization_name?: string;
  disclaimer_text?: string;
  phone_number?: string;
  address?: Address;
  office_sought?: OfficeSought;
  candidate_first_name?: string;
  candidate_middle_name?: string;
  candidate_last_name?: string;
  candidate_suffix?: CandidateSuffix;
}

export interface ActBlueSubmissionData extends ActBlueFormData {
  committee_type: CommitteeType;
  city: string;
  zip_code: string;
}

export function validateOfficeSought(office: string): office is OfficeSought {
  const validOffices: OfficeSought[] = [
    "U.S. President",
    "U.S. Senator",
    "U.S. Representative",
    "Governor",
    "Lieutenant Governor",
    "State Senator",
    "State Representative",
    "Attorney General",
    "Secretary of State",
    "School Board Member"
  ];
  return validOffices.includes(office as OfficeSought);
}