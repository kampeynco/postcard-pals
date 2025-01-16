import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/Auth";

// Types
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

// Form schema
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

// Combined hook
export const useOnboarding = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[\D]/g, "");
    if (number.length <= 3) return `(${number}`;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: onboardingData?.first_name || "",
      last_name: onboardingData?.last_name || "",
      phone_number: formatPhoneNumber(onboardingData?.phone_number || ""),
    },
  });

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      if (!session) {
        setLoading(false);
        console.log('No session found, skipping data load.'); // Debugging statement
        return;
      }

      console.log('Session state:', session); // Debugging statement

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_step')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      console.log('Fetched profile data:', profile); // Debugging statement

      if (profile) {
        console.log('Loading onboarding state:', profile);
        setOnboardingData((profile.onboarding_data as OnboardingData) || {});
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
      if (!session) return;

      console.log("Saving onboarding state:", { data, step });
      const updatedData = { ...onboardingData, ...data };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_data: updatedData,
          onboarding_step: step,
          updated_at: new Date().toISOString()
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
    form,
    onboardingData,
    currentStep,
    loading,
    saveOnboardingState,
    formatPhoneNumber,
  };
};