import { FormValues } from "../types";

export interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: Array<keyof FormValues>;
  isOptional?: boolean;
}

export interface StepValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Committee Details",
    description: "Enter your committee information",
    fields: ["committee_type", "committee_name", "candidate_name", "office_sought"],
  },
  {
    id: 2,
    title: "Address Information",
    description: "Enter your committee's address",
    fields: ["street_address", "city", "state", "zip_code"],
  },
  {
    id: 3,
    title: "Disclaimer",
    description: "Set your campaign disclaimer",
    fields: ["disclaimer_text"],
  },
];

export const getStepFields = (step: number, committeeType: string): Array<keyof FormValues> => {
  const stepConfig = FORM_STEPS.find(s => s.id === step);
  if (!stepConfig) return [];

  if (step === 1 && committeeType !== "candidate") {
    return stepConfig.fields.filter(field => 
      !["candidate_name", "office_sought"].includes(field as string)
    );
  }

  return stepConfig.fields;
};

export const getTotalSteps = (committeeType: string): number => {
  return committeeType === "candidate" ? 3 : 2;
};