import { z } from "zod";

export const committeeTypes = [
  "candidate",
  "political_action_committee",
  "non_profit"
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

export const formSchema = z.object({
  committee_name: z.string().min(1, "Committee name is required"),
  committee_type: z.enum(committeeTypes),
  candidate_name: z.string().optional(),
  office_sought: z.enum(officeOptions).optional(),
  disclaimer_text: z.string().optional(),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string()
  }).optional()
});

export type FormValues = z.infer<typeof formSchema>;