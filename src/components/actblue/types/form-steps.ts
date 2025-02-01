import { FormValues, CandidateFormValues } from "../types";

export interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: Array<keyof FormValues>;
  isOptional?: boolean;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Committee Details",
    description: "Enter your committee information",
    fields: [
      "committee_type",
      "legal_committee_name",
      "organization_name",
    ],
  },
  {
    id: 2,
    title: "Address Information",
    description: "This will be the return address on postcards.",
    fields: ["street_address", "city", "state", "zip_code"],
  },
  {
    id: 3,
    title: "Disclaimer",
    description: "Set your campaign disclaimer",
    fields: ["disclaimer_text"],
  },
];

export const getCandidateFields = (): Array<keyof CandidateFormValues> => [
  "candidate_first_name",
  "candidate_middle_name",
  "candidate_last_name",
  "candidate_suffix",
  "office_sought"
];

export const getStepFields = (step: number, committeeType: string): Array<keyof FormValues> => {
  const stepConfig = FORM_STEPS.find(s => s.id === step);
  if (!stepConfig) return [];

  if (step === 1 && committeeType === "candidate") {
    return [...stepConfig.fields, ...getCandidateFields()] as Array<keyof FormValues>;
  }

  return stepConfig.fields as Array<keyof FormValues>;
};

export const getTotalSteps = (committeeType: string): number => {
  return committeeType === "candidate" ? 3 : 2;
};