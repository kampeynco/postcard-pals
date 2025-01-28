import { OnboardingStep } from "../types/onboarding";

export const ONBOARDING_STEPS: Omit<OnboardingStep, "completed">[] = [
  {
    id: 1,
    title: "Campaign Details",
    description: "Tell us about your campaign",
    formStep: 1
  },
  {
    id: 2,
    title: "Verify Account Address",
    description: "Verify your campaign office address",
    formStep: 2
  },
  {
    id: 3,
    title: "Connect ActBlue",
    description: "Link your ActBlue account",
    formStep: 3
  }
];