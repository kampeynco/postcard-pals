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

      // Prepare the ActBlue account data
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
      const { data: existingAccount, error: fetchError } = await supabase
        .from("actblue_accounts")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let actblueAccountId: string;

      if (existingAccount) {
        // Update existing account
        const { error: updateError } = await supabase
          .from("actblue_accounts")
          .update(insertData)
          .eq("user_id", session.user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        actblueAccountId = existingAccount.id;
      } else {
        // Create new account
        const { data: newAccount, error: insertError } = await supabase
          .from("actblue_accounts")
          .insert([insertData])
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newAccount) throw new Error("Failed to create ActBlue account");
        actblueAccountId = newAccount.id;
      }

      // Save the verified address
      const { error: addressError } = await supabase
        .from("addresses")
        .insert({
          actblue_account_id: actblueAccountId,
          lob_id: 'manual_verification', // Since this is manually verified
          address_data: verifiedAddress,
          is_verified: true,
          last_verified_at: new Date().toISOString()
        });

      if (addressError) throw addressError;

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