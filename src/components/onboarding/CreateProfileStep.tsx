import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CreateProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CreateProfileStep({ onNext, onBack }: CreateProfileStepProps) {
  const { form } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createActBlueAccount = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("actblue_accounts")
        .insert({
          user_id: userId,
          committee_name: "",
          committee_type: "candidate",
          street_address: "",
          city: "",
          state: "",
          zip_code: "",
          disclaimer_text: "",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating ActBlue account:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to create ActBlue account:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await form.trigger();
      
      if (!form.formState.isValid) {
        const errors = Object.keys(form.formState.errors);
        if (errors.length > 0) {
          toast.error(`Please fill in all required fields: ${errors.join(", ")}`);
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("No authenticated user found");
        return;
      }

      // Create ActBlue account after profile is saved
      await createActBlueAccount(session.user.id);
      
      await onNext();
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error("Failed to save profile details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepWrapper
      title="Create Your Profile"
      description="Set up your account details to get started"
      onNext={handleSubmit}
      onBack={onBack}
      isSubmitting={isSubmitting}
      isValid={form.formState.isValid}
      showCompletionIcon={false}
    >
      <ProfileFormFields />
    </StepWrapper>
  );
}