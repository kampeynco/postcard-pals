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

export const formSchema = z.object({
  committee_name: z.string().min(2, "Campaign name must be at least 2 characters"),
  office_sought: z.enum(officeOptions, {
    required_error: "Please select an office",
  }),
});

export type FormValues = z.infer<typeof formSchema>;