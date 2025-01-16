import { Button } from "@/components/ui/button";
import { CampaignForm } from "./campaign/CampaignForm";
import { useOnboarding } from "./hooks/useOnboarding";
import { FormValues } from "./campaign/types";
import { toast } from "sonner";

interface CampaignDetailsStepProps {
  onNext: (values: FormValues) => void;
  onBack: () => void;
}

export function CampaignDetailsStep({ onNext, onBack }: CampaignDetailsStepProps) {
  const { form } = useOnboarding();

  const handleSubmit = async (values: FormValues) => {
    try {
      await form.trigger();
      if (!form.formState.isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
      await onNext(values);
    } catch (error) {
      console.error('Error submitting campaign details:', error);
      toast.error("Failed to save campaign details");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Campaign Details</h2>
      <p className="text-sm text-gray-600">
        Provide details about your campaign to get started.
      </p>
      <CampaignForm onSubmit={handleSubmit} />
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={form.handleSubmit(handleSubmit)}>Continue</Button>
      </div>
    </div>
  );
}