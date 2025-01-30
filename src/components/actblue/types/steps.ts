export type FormStep = {
  id: number;
  title: string;
  description: string;
};

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Committee Details",
    description: "Enter your committee information",
  },
  {
    id: 2,
    title: "Address Verification",
    description: "Verify your campaign address",
  },
  {
    id: 3,
    title: "Disclaimer",
    description: "Set your campaign disclaimer",
  },
];

export const getStepTitle = (step: number): string => {
  return FORM_STEPS.find(s => s.id === step)?.title || "";
};

export const getStepDescription = (step: number): string => {
  return FORM_STEPS.find(s => s.id === step)?.description || "";
};