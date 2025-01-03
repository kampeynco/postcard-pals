import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/Auth";

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
}

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
  email: z.string().email().optional(),
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
      first_name: "",
      last_name: "",
      phone_number: "",
      email: session?.user?.email,
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      loadOnboardingState();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const loadOnboardingState = async () => {
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_step')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading onboarding state:', error);
        toast.error('Failed to load your progress. Please try refreshing the page.');
        return;
      }

      if (profile) {
        const savedData = profile.onboarding_data as OnboardingData;
        setOnboardingData(savedData || {});
        setCurrentStep(profile.onboarding_step || 1);
        
        // Update form with saved data
        if (savedData) {
          Object.entries(savedData).forEach(([key, value]) => {
            if (typeof value === 'string' && form.getValues(key as keyof ProfileFormValues) !== undefined) {
              form.setValue(key as keyof ProfileFormValues, value);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      toast.error('Failed to load your progress. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingState = async (data: Partial<OnboardingData>, step: number) => {
    try {
      if (!session?.user?.id) {
        toast.error('Please sign in to save your progress');
        return;
      }

      const updatedData = { ...onboardingData, ...data };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_data: updatedData,
          onboarding_step: step,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('Error saving onboarding state:', error);
        toast.error('Failed to save your progress');
        return;
      }

      setOnboardingData(updatedData);
      setCurrentStep(step);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      toast.error('Failed to save your progress');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
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