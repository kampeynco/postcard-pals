import { CampaignForm } from "./campaign/CampaignForm";
import { useOnboarding } from "./hooks/useOnboarding";
import { FormValues } from "./campaign/types";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";

interface CampaignDetailsStepProps {
  onNext: (values: FormValues) => void;
  onBack: () => void;
}

export function CampaignDetailsStep({ onNext, onBack }: CampaignDetailsStepProps) {
  const { form } = useOnboarding();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      await form.trigger();
      if (!form.formState.isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
      setIsCompleted(true);
      await onNext(values);
    } catch (error) {
      console.error('Error submitting campaign details:', error);
      toast.error("Failed to save campaign details");
    }
  };

  return (
    <StepWrapper
      title="Campaign Details"
      description="Provide details about your campaign to get started"
      onNext={form.handleSubmit(handleSubmit)}
      onBack={onBack}
      isSubmitting={form.formState.isSubmitting}
      isValid={form.formState.isValid}
      isCompleted={isCompleted}
    >
      <CampaignForm onSubmit={handleSubmit} />
    </StepWrapper>
  );
}