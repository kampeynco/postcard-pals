import type { Profile } from "@/integrations/supabase/types";

export type ProfileCheckResult =
  | { type: 'complete'; profile: Profile }
  | { type: 'incomplete'; profile: Profile }
  | { type: 'deleted' }
  | { type: 'error' };

export interface StepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data?: any;
}

export interface OnboardingStep {
  title: string;
  component: React.ComponentType<StepProps>;
}