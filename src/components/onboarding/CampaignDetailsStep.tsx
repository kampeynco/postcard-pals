import { CampaignForm } from "./campaign/CampaignForm";
import { useOnboarding } from "./hooks/useOnboarding";
import { FormValues } from "./campaign/types";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Check } from "lucide-react";

interface CampaignDetailsStepProps {
  onNext: (values: FormValues) => void;
  onBack: () => void;
}

export function CampaignDetailsStep({ onNext, onBack }: CampaignDetailsStepProps) {
  const { form } = useOnboarding();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await form.trigger();
      if (!form.formState.isValid) {
        const errors = Object.keys(form.formState.errors);
        if (errors.length > 0) {
          toast.error(`Please fill in all required fields: ${errors.join(", ")}`);
        }
        return;
      }

      await onNext(values);
      setIsCompleted(true);
      toast.success("Campaign details saved successfully!");
    } catch (error) {
      console.error('Error submitting campaign details:', error);
      toast.error("Failed to save campaign details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepWrapper
      title="Campaign Details"
      description="Provide details about your campaign to get started"
      onNext={form.handleSubmit(handleSubmit)}
      onBack={onBack}
      isSubmitting={isSubmitting}
      isValid={form.formState.isValid}
      isCompleted={isCompleted}
    >
      <div className="relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
        <CampaignForm onSubmit={handleSubmit} />
      </div>
    </StepWrapper>
  );
}