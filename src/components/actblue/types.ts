import { z } from "zod";
import { CandidateSuffix, CommitteeType, OfficeSought } from "@/types/actblue";

export const suffixOptions = [
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "V"
] as const;

export const officeOptions = [
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
] as const;

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

export const formSchema = z.object({
  legal_committee_name: z.string().min(2, "Legal committee name must be at least 2 characters"),
  organization_name: z.string().optional(),
  committee_type: z.enum(["candidate", "political_action_committee", "non_profit"] as const),
  candidate_first_name: z.string().min(1, "First name is required").optional(),
  candidate_middle_name: z.string().optional(),
  candidate_last_name: z.string().min(1, "Last name is required").optional(),
  candidate_suffix: z.enum(suffixOptions).nullable(),
  office_sought: z.enum(officeOptions).optional(),
  address: addressSchema,
  disclaimer_text: z.string().min(1, "Disclaimer text is required"),
}).refine(
  (data) => {
    if (data.committee_type === "candidate") {
      return !!data.candidate_first_name && !!data.candidate_last_name && !!data.office_sought;
    }
    return true;
  },
  {
    message: "Candidate first name, last name, and office sought are required for candidate committees",
    path: ["candidate_first_name"],
  }
);

export type { CandidateSuffix, CommitteeType, OfficeSought };