import { CampaignForm } from "./CampaignForm";
import { useCampaignSubmit } from "./hooks/useCampaignSubmit";
import type { FormValues } from "./types";
import type { AddressInput } from "@/components/address/types";

interface CampaignDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const CampaignDetailsStep = ({ onNext, onBack }: CampaignDetailsStepProps) => {
  const { handleSubmit } = useCampaignSubmit(onNext);

  const onSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      await handleSubmit(values, verifiedAddress);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Campaign Details</h2>
        <p className="text-gray-500 text-sm">Tell us about your campaign</p>
      </div>

      <CampaignForm onSubmit={onSubmit} />
      
      <div className="text-center mt-4">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Back to previous step
        </button>
      </div>
    </div>
  );
};