import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/Auth";
import { OnboardingData } from "../types";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export const useOnboarding = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: onboardingData?.first_name || "",
      last_name: onboardingData?.last_name || "",
      phone_number: onboardingData?.phone_number || "",
    },
  });

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_step')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        // Ensure the onboarding_data is properly typed
        const typedOnboardingData: OnboardingData = profile.onboarding_data as OnboardingData || {};
        setOnboardingData(typedOnboardingData);
        setCurrentStep(profile.onboarding_step);
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      toast.error('Failed to load onboarding data.');
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingState = async (data: Partial<OnboardingData>, step: number) => {
    try {
      if (!session) return;

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
  };
};