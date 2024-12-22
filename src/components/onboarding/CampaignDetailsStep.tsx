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

      const insertData: ActBlueAccount = {
        committee_name: values.committee_name,
        committee_type: values.committee_type,
        candidate_name: values.committee_type === 'candidate' ? values.candidate_name : null,
        office_sought: values.committee_type === 'candidate' ? values.office_sought : null,
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

      console.log('Creating ActBlue account with data:', insertData);

      const { error: actblueError } = await supabase
        .from("actblue_accounts")
        .insert([insertData]);

      if (actblueError) {
        console.error('Error creating ActBlue account:', actblueError);
        throw actblueError;
      }

      console.log('ActBlue account created successfully');
      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      console.error('Error in campaign details submission:', error);
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