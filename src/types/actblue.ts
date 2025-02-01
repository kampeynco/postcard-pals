// Base types
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

// Address interfaces
export interface FormAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface SubmissionAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip_code: string;
}

// Form interfaces
export interface BaseActBlueForm {
  legal_committee_name: string;
  organization_name?: string;
  committee_type: CommitteeType;
  disclaimer_text: string;
  address: FormAddress;
}

export interface CandidateForm extends BaseActBlueForm {
  committee_type: "candidate";
  candidate_first_name: string;
  candidate_middle_name?: string;
  candidate_last_name: string;
  candidate_suffix?: CandidateSuffix;
  office_sought: OfficeSought;
}

export interface NonCandidateForm extends BaseActBlueForm {
  committee_type: "political_action_committee" | "non_profit";
}

export type ActBlueFormData = CandidateForm | NonCandidateForm;

// Type guards
export function isCandidateForm(form: ActBlueFormData): form is CandidateForm {
  return form.committee_type === "candidate";
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

// Address conversion utilities
export function convertToSubmissionAddress(formAddress: FormAddress): SubmissionAddress {
  return {
    street1: formAddress.street,
    city: formAddress.city,
    state: formAddress.state,
    zip_code: formAddress.zip_code
  };
}