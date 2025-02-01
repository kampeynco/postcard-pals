import { z } from "zod";

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
  | "State Treasurer"
  | "Mayor"
  | "City Council Member"
  | "County Commissioner"
  | "District Attorney"
  | "Sheriff"
  | "School Board Member";

export type CommitteeType = "candidate" | "political_action_committee" | "non_profit";

// Form interfaces
export interface AddressFormValues {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface BaseFormValues {
  legal_committee_name: string;
  organization_name?: string;
  committee_type: CommitteeType;
  disclaimer_text: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface CandidateFormValues extends BaseFormValues {
  committee_type: "candidate";
  candidate_first_name: string;
  candidate_middle_name?: string;
  candidate_last_name: string;
  candidate_suffix?: CandidateSuffix | null;
  office_sought: OfficeSought;
}

export interface NonCandidateFormValues extends BaseFormValues {
  committee_type: "political_action_committee" | "non_profit";
}

export type FormValues = CandidateFormValues | NonCandidateFormValues;

// Zod schema for form validation
const addressSchema = z.object({
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

export const formSchema = z.discriminatedUnion("committee_type", [
  z.object({
    legal_committee_name: z.string().min(2, "Legal committee name must be at least 2 characters"),
    organization_name: z.string().optional(),
    committee_type: z.literal("candidate"),
    candidate_first_name: z.string().min(1, "First name is required"),
    candidate_middle_name: z.string().optional(),
    candidate_last_name: z.string().min(1, "Last name is required"),
    candidate_suffix: z.enum(["Jr.", "Sr.", "II", "III", "IV", "V"] as const).nullable(),
    office_sought: z.enum([
      "U.S. President",
      "U.S. Senator",
      "U.S. Representative",
      "Governor",
      "Lieutenant Governor",
      "State Senator",
      "State Representative",
      "Attorney General",
      "Secretary of State",
      "State Treasurer",
      "Mayor",
      "City Council Member",
      "County Commissioner",
      "District Attorney",
      "Sheriff",
      "School Board Member"
    ] as const),
    ...addressSchema.shape,
    disclaimer_text: z.string().min(1, "Disclaimer text is required"),
  }),
  z.object({
    legal_committee_name: z.string().min(2, "Legal committee name must be at least 2 characters"),
    organization_name: z.string().optional(),
    committee_type: z.enum(["political_action_committee", "non_profit"]),
    ...addressSchema.shape,
    disclaimer_text: z.string().min(1, "Disclaimer text is required"),
  })
]);

// Type guards
export function isCandidateForm(form: FormValues): form is CandidateFormValues {
  return form.committee_type === "candidate";
}

export const officeOptions: OfficeSought[] = [
  "U.S. President",
  "U.S. Senator",
  "U.S. Representative",
  "Governor",
  "Lieutenant Governor",
  "State Senator",
  "State Representative",
  "Attorney General",
  "Secretary of State",
  "State Treasurer",
  "Mayor",
  "City Council Member",
  "County Commissioner",
  "District Attorney",
  "Sheriff",
  "School Board Member"
];