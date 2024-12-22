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

      // Prepare the data for insertion
      const insertData: ActBlueAccount = {
        user_id: session.user.id,
        committee_name: values.committee_name,
        committee_type: values.committee_type,
        candidate_name: values.committee_type === 'candidate' ? values.candidate_name : null,
        office_sought: values.committee_type === 'candidate' ? values.office_sought : null,
        street_address: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code,
        disclaimer_text: values.disclaimer_text,
        is_created: true,
        is_onboarded: false,
        is_active: false
      };

      // Check if an account already exists for this user
      const { data: existingAccount } = await supabase
        .from("actblue_accounts")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (existingAccount) {
        // Update existing account
        const { error: updateError } = await supabase
          .from("actblue_accounts")
          .update(insertData)
          .eq("user_id", session.user.id);

        if (updateError) throw updateError;
      } else {
        // Create new account
        const { error: insertError } = await supabase
          .from("actblue_accounts")
          .insert([insertData]);

        if (insertError) throw insertError;
      }

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