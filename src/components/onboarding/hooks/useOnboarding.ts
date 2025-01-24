import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/Auth";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        if (!session?.user) {
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (profile) {
          form.reset({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            phone_number: profile.phone_number || "",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading onboarding state:', error);
        toast.error("Failed to load your profile");
        setLoading(false);
      }
    };

    loadOnboardingState();
  }, [session, form]);

  const saveOnboardingState = async (data: Partial<ProfileFormValues>, step: number) => {
    try {
      if (!session?.user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setCurrentStep(step);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      toast.error('Failed to save your progress');
      throw error;
    }
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    currentStep,
    loading,
    saveOnboardingState,
    resetForm,
  };
};