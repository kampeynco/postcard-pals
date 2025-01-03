import { z } from "zod";

const officeOptions = [
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
  committee_name: z.string().min(2, "Committee name must be at least 2 characters"),
  committee_type: z.enum(["candidate", "political_action_committee", "non_profit"]),
  candidate_name: z.string().optional(),
  office_sought: z.enum(officeOptions).optional(),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  disclaimer_text: z.string().min(1, "Disclaimer text is required"),
}).refine(
  (data) => {
    if (data.committee_type === "candidate") {
      return !!data.candidate_name && !!data.office_sought;
    }
    return true;
  },
  {
    message: "Candidate name and office sought are required for candidate committees",
    path: ["candidate_name"],
  }
);

export type FormValues = z.infer<typeof formSchema>;
export type OfficeType = typeof officeOptions[number];