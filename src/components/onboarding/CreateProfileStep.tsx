import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";

interface CreateProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CreateProfileStep({ onNext, onBack }: CreateProfileStepProps) {
  const { form } = useOnboarding();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async () => {
    try {
      await form.trigger();
      if (!form.formState.isValid) {
        toast.error("Please fill in all required fields correctly");
        return;
      }
      setIsCompleted(true);
      await onNext();
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error("Failed to save profile details");
    }
  };

  return (
    <StepWrapper
      title="Create Your Profile"
      description="Set up your account details to get started"
      onNext={handleSubmit}
      onBack={onBack}
      isSubmitting={form.formState.isSubmitting}
      isValid={form.formState.isValid}
      isCompleted={isCompleted}
    >
      <ProfileFormFields />
    </StepWrapper>
  );
}