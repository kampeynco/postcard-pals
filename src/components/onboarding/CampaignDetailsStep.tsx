import { useAuth } from "@/components/auth/AuthProvider";
import { CampaignForm } from "./campaign/CampaignForm";
import { submitCampaignDetails } from "./campaign/CampaignSubmission";
import type { FormValues } from "./campaign/types";
import type { AddressInput } from "../address/types";

interface CampaignDetailsStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export const CampaignDetailsStep = ({ onNext, onBack }: CampaignDetailsStepProps) => {
  const { session } = useAuth();

  const onSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to continue");
      return;
    }

    await submitCampaignDetails(values, verifiedAddress, session.user.id, onNext);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Campaign Details</h2>
        <p className="text-gray-500 text-sm">Tell us about your campaign</p>
      </div>

      <CampaignForm onSubmit={onSubmit} />

      {onBack && (
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm mt-4 block mx-auto"
        >
          Back
        </button>
      )}
    </div>
  );
};