import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OnboardingData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  committee_name?: string;
  committee_type?: string;
  candidate_name?: string;
  office_sought?: string;
  disclaimer_text?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  front_color?: string;
  logo_alignment?: string;
  back_message?: string;
}

export const useOnboardingState = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_step')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setOnboardingData(profile.onboarding_data as OnboardingData || {});
        setCurrentStep(profile.onboarding_step || 1);
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      toast.error('Failed to load your progress');
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingState = async (data: Partial<OnboardingData>, step: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const updatedData = { ...onboardingData, ...data };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_data: updatedData,
          onboarding_step: step
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setOnboardingData(updatedData);
      setCurrentStep(step);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      toast.error('Failed to save your progress');
    }
  };

  return {
    onboardingData,
    currentStep,
    loading,
    saveOnboardingState,
  };
};