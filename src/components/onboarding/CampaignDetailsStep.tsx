import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { CampaignForm } from "./campaign/CampaignForm";
import type { FormValues } from "./campaign/types";
import type { AddressInput } from "../address/types";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";

interface CampaignDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export const CampaignDetailsStep = ({ onNext, onBack }: CampaignDetailsStepProps) => {
  const { session } = useAuth();

  const onSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      console.log('Starting submission with values:', values);
      console.log('Verified address:', verifiedAddress);

      if (!session?.user?.id) {
        console.error('No user session found');
        toast.error("Please sign in to continue");
        return;
      }

      if (!verifiedAddress) {
        console.error('No verified address provided');
        toast.error("Please verify your address before continuing");
        return;
      }

      // Data validation
      if (!values.committee_name || !values.committee_type || !values.disclaimer_text) {
        console.error('Missing required fields:', { values });
        toast.error("Please fill in all required fields");
        return;
      }

      if (values.committee_type === 'candidate' && (!values.candidate_name || !values.office_sought)) {
        console.error('Missing candidate-specific fields');
        toast.error("Please fill in all candidate information");
        return;
      }

      // Start database transaction
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error("Authentication required");
      }

      // Prepare the ActBlue account data
      const insertData: ActBlueAccount = {
        user_id: user.id,
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

      console.log('Preparing to insert ActBlue account:', insertData);

      // Check if an account already exists
      const { data: existingAccount, error: fetchError } = await supabase
        .from("actblue_accounts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing account:', fetchError);
        throw fetchError;
      }

      let actblueAccountId: string;

      if (existingAccount) {
        console.log('Updating existing account:', existingAccount.id);
        const { data: updatedAccount, error: updateError } = await supabase
          .from("actblue_accounts")
          .update(insertData)
          .eq("id", existingAccount.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating ActBlue account:', updateError);
          throw updateError;
        }
        if (!updatedAccount) {
          console.error('No account returned after update');
          throw new Error("Failed to update ActBlue account");
        }
        actblueAccountId = existingAccount.id;
      } else {
        console.log('Creating new account');
        const { data: newAccount, error: insertError } = await supabase
          .from("actblue_accounts")
          .insert([insertData])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting ActBlue account:', insertError);
          throw insertError;
        }
        if (!newAccount) {
          console.error('No account returned after insert');
          throw new Error("Failed to create ActBlue account");
        }
        actblueAccountId = newAccount.id;
      }

      console.log('Successfully saved ActBlue account:', actblueAccountId);

      // Prepare and save address data
      const addressData = {
        street: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code
      } as Json;

      console.log('Preparing to save address:', addressData);

      const { error: addressError } = await supabase
        .from("addresses")
        .upsert({
          actblue_account_id: actblueAccountId,
          lob_id: 'manual_verification',
          address_data: addressData,
          is_verified: true,
          last_verified_at: new Date().toISOString()
        }, {
          onConflict: 'actblue_account_id'
        });

      if (addressError) {
        console.error('Error saving address:', addressError);
        throw addressError;
      }

      console.log('Successfully saved address data');
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