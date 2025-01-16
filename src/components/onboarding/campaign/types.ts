import { z } from "zod";

export const formSchema = z.object({
  committee_name: z.string().min(1, "Committee name is required"),
  committee_type: z.enum(["candidate", "political_action_committee", "non_profit"]),
  candidate_name: z.string().optional(),
  office_sought: z.string().optional(),
  disclaimer_text: z.string().optional(),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

export type FormValues = z.infer<typeof formSchema>;