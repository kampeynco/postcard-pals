import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { CampaignForm } from "./campaign/CampaignForm";
import type { FormValues } from "./campaign/types";
import type { AddressInput } from "../address/types";

interface CampaignDetailsStepProps {
  onNext: () => void;
}

export const CampaignDetailsStep = ({ onNext }: CampaignDetailsStepProps) => {
  const { session } = useAuth();

  const onSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      if (!verifiedAddress) {
        toast.error("Please verify your address before continuing");
        return;
      }

      const { error } = await supabase
        .from("actblue_accounts")
        .insert({
          committee_name: values.committee_name,
          office_sought: values.office_sought,
          committee_type: "candidate",
          user_id: session?.user.id,
          disclaimer_text: "Paid for by " + values.committee_name,
          street_address: verifiedAddress.street,
          city: verifiedAddress.city,
          state: verifiedAddress.state,
          zip_code: verifiedAddress.zip_code,
          is_created: true
        });

      if (error) throw error;

      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      console.error('Error saving campaign details:', error);
      toast.error("Failed to save campaign details");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Campaign Details</h2>
        <p className="text-gray-500 text-sm">Tell us about your campaign</p>
      </div>

      <CampaignForm onSubmit={onSubmit} />
    </div>
  );
};