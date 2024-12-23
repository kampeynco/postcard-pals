import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FormValues } from "../types";
import type { AddressInput } from "@/components/address/types";
import type { Database } from "@/integrations/supabase/types";

export const useCampaignSubmit = (onNext: () => void) => {
  const handleSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      console.log('Starting submission with values:', values);
      console.log('Verified address:', verifiedAddress);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error("Authentication required");
      }

      if (!verifiedAddress) {
        console.error('No verified address provided');
        throw new Error("Address verification required");
      }

      // Data validation
      if (!values.committee_name || !values.committee_type || !values.disclaimer_text) {
        console.error('Missing required fields:', { values });
        throw new Error("Please fill in all required fields");
      }

      if (values.committee_type === 'candidate' && (!values.candidate_name || !values.office_sought)) {
        console.error('Missing candidate-specific fields');
        throw new Error("Please fill in all candidate information");
      }

      // Check for existing account
      const { data: existingAccount, error: fetchError } = await supabase
        .from("actblue_accounts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing account:', fetchError);
        throw fetchError;
      }

      const accountData = {
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

      let actblueAccountId: string;

      if (existingAccount) {
        console.log('Updating existing account:', existingAccount.id);
        const { data: updatedAccount, error: updateError } = await supabase
          .from("actblue_accounts")
          .update(accountData)
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
          .insert([accountData])
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

      // Save address data
      const addressData = {
        street: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code
      };

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

      console.log('Successfully saved all data');
      toast.success("Campaign details saved successfully");
      onNext(); // Call onNext after successful save
    } catch (error) {
      console.error('Error in campaign details submission:', error);
      if (error instanceof Error) {
        toast.error(`Failed to save campaign details: ${error.message}`);
      } else {
        toast.error("Failed to save campaign details. Please try again.");
      }
      throw error; // Re-throw to handle in the component
    }
  };

  return { handleSubmit };
};