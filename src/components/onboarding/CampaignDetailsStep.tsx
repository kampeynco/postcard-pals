import { CampaignForm } from "./campaign/CampaignForm";
import { useOnboarding } from "./hooks/useOnboarding";
import { FormValues } from "./campaign/types";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface CampaignDetailsStepProps {
  onNext: (values: FormValues) => void;
}

export function CampaignDetailsStep({ onNext }: CampaignDetailsStepProps) {
  const { form } = useOnboarding();
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
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
      await onNext(values);
    } catch (error) {
      console.error('Error submitting campaign details:', error);
      toast.error("Failed to save campaign details");
    }
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <StepWrapper
      title="Campaign Details"
      description="Provide details about your campaign to get started"
      onNext={form.handleSubmit(handleSubmit)}
      onBack={handleBack}
      isSubmitting={form.formState.isSubmitting}
      isValid={form.formState.isValid}
      isCompleted={isCompleted}
    >
      <CampaignForm onSubmit={handleSubmit} />
    </StepWrapper>
  );
}