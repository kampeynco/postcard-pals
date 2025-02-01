import { z } from "zod";
import { officeOptions } from "./base";

export const addressSchema = z.object({
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
    office_sought: z.enum(officeOptions as [string, ...string[]]),
    ...addressSchema.shape,
    disclaimer_text: z.string().min(1, "Disclaimer text is required"),
  }),
  z.object({
    legal_committee_name: z.string().min(2, "Legal committee name must be at least 2 characters"),
    organization_name: z.string().optional(),
    committee_type: z.literal("organization"),
    ...addressSchema.shape,
    disclaimer_text: z.string().min(1, "Disclaimer text is required"),
  })
]);