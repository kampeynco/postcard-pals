export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  formStep: number;
  completed: boolean;
}

export interface OnboardingState {
  currentStep: number;
  steps: OnboardingStep[];
}