import { z } from "zod";

export const addressSchema = z.object({
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

export const committeeSchema = z.object({
  legal_committee_name: z.string().min(2, "Legal committee name must be at least 2 characters"),
  organization_name: z.string().optional(),
  committee_type: z.enum(["candidate", "political_action_committee", "non_profit"]),
  disclaimer_text: z.string().min(1, "Disclaimer text is required"),
});

export const candidateSchema = z.object({
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
});

export const formSchema = z.discriminatedUnion("committee_type", [
  committeeSchema.extend({
    committee_type: z.literal("candidate"),
    ...candidateSchema.shape,
    ...addressSchema.shape,
  }),
  committeeSchema.extend({
    committee_type: z.enum(["political_action_committee", "non_profit"]),
    ...addressSchema.shape,
  }),
]);

export type FormValues = z.infer<typeof formSchema>;