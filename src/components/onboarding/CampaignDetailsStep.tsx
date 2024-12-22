import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { CampaignForm } from "./campaign/CampaignForm";
import type { FormValues } from "./campaign/types";
import type { AddressInput } from "../address/types";
import type { Database } from "@/integrations/supabase/types";

interface CampaignDetailsStepProps {
  onNext: () => void;
}

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export const CampaignDetailsStep = ({ onNext }: CampaignDetailsStepProps) => {
  const { session } = useAuth();

  const onSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      if (!session?.user?.id) {
        toast.error("Please sign in to continue");
        return;
      }

      if (!verifiedAddress) {
        toast.error("Please verify your address before continuing");
        return;
      }

      console.log('Attempting to save campaign details with values:', values);
      console.log('Verified address:', verifiedAddress);

      const insertData: ActBlueAccount = {
        committee_name: values.committee_name,
        committee_type: values.committee_type,
        office_sought: values.office_sought,
        user_id: session.user.id,
        disclaimer_text: values.disclaimer_text,
        street_address: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code,
        is_created: true,
        is_onboarded: false,
        is_active: false
      };

      console.log('Inserting data into actblue_accounts:', insertData);

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(insertData);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Campaign details saved successfully');
      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      console.error('Error saving campaign details:', error);
      if (error instanceof Error) {
        toast.error(`Failed to save campaign details: ${error.message}`);
      } else {
        toast.error("Failed to save campaign details. Please try again.");
      }
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