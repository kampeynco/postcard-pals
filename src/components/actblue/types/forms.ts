import { CandidateSuffix, CommitteeType, OfficeSought } from "./base";

export interface BaseFormValues {
  legal_committee_name: string;
  organization_name?: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  disclaimer_text: string;
}

export interface CandidateFormValues extends BaseFormValues {
  committee_type: "candidate";
  candidate_first_name: string;
  candidate_middle_name?: string;
  candidate_last_name: string;
  candidate_suffix?: CandidateSuffix | null;
  office_sought: OfficeSought;
}

export interface OrganizationFormValues extends BaseFormValues {
  committee_type: "organization";
}

export type FormValues = CandidateFormValues | OrganizationFormValues;

export function isCandidateForm(form: FormValues): form is CandidateFormValues {
  return form.committee_type === "candidate";
}