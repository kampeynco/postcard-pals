import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types/database";

// Define the base Profile type from the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];

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

// Re-export auth context types
export interface AuthContextType {
  session: Session | null;
  loading: boolean;
}