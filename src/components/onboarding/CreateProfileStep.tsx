import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface CreateProfileStepProps {
  onNext: () => void;
}

export function CreateProfileStep({ onNext }: CreateProfileStepProps) {
  const { form } = useOnboarding();
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await form.trigger();
      if (!form.formState.isValid) {
        const errors = Object.keys(form.formState.errors);
        if (errors.length > 0) {
          toast.error(`Please fill in all required fields: ${errors.join(", ")}`);
        }
        return;
      }
      setIsCompleted(true);
      await onNext();
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error("Failed to save profile details");
    }
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <StepWrapper
      title="Create Your Profile"
      description="Set up your account details to get started"
      onNext={handleSubmit}
      onBack={handleBack}
      isSubmitting={form.formState.isSubmitting}
      isValid={form.formState.isValid}
      isCompleted={isCompleted}
    >
      <ProfileFormFields />
    </StepWrapper>
  );
}