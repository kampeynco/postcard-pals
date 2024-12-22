import { z } from "zod";

export const officeOptions = [
  // Federal Offices
  "U.S. President",
  "U.S. Senator",
  "U.S. Representative",
  // State Offices
  "Governor",
  "Lieutenant Governor",
  "State Senator",
  "State Representative",
  "Attorney General",
  "Secretary of State",
  "State Treasurer",
  // Local Offices
  "Mayor",
  "City Council Member",
  "County Commissioner",
  "District Attorney",
  "Sheriff",
  "School Board Member"
] as const;

export const committeeTypes = [
  "candidate",
  "political_action_committee",
  "non_profit"
] as const;

export const formSchema = z.object({
  committee_name: z.string().min(2, "Campaign name must be at least 2 characters"),
  committee_type: z.enum(committeeTypes, {
    required_error: "Please select a committee type",
  }),
  candidate_name: z.string().optional(),
  office_sought: z.enum(officeOptions, {
    required_error: "Please select an office",
  }),
  disclaimer_text: z.string().min(1, "Disclaimer text is required"),
});

export type FormValues = z.infer<typeof formSchema>;