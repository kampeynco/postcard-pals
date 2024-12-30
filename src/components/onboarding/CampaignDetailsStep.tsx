import { Button } from "@/components/ui/button";
import { CampaignForm } from "./campaign/CampaignForm";
import { useOnboarding } from "./hooks/useOnboarding";

interface CampaignDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CampaignDetailsStep({ onNext, onBack }: CampaignDetailsStepProps) {
  const { form } = useOnboarding();

  const handleSubmit = async (values: any) => {
    await onNext();
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
