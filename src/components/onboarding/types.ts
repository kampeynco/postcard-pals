export interface OnboardingData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  committee_name?: string;
  committee_type?: string;
  candidate_name?: string;
  office_sought?: string;
  disclaimer_text?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
}