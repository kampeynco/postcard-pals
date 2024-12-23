import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FormValues } from "./types";
import type { AddressInput } from "@/components/address/types";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export const submitCampaignDetails = async (
  values: FormValues,
  verifiedAddress: AddressInput | null,
  userId: string,
  onSuccess: () => void
) => {
  try {
    if (!verifiedAddress) {
      toast.error("Please verify your address before continuing");
      return;
    }

    // Prepare the ActBlue account data
    const insertData: ActBlueAccount = {
      user_id: userId,
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
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let actblueAccountId: string;

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabase
        .from("actblue_accounts")
        .update(insertData)
        .eq("user_id", userId)
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
    const addressData = {
      actblue_account_id: actblueAccountId,
      lob_id: 'manual_verification',
      address_data: verifiedAddress as unknown as Json,
      is_verified: true,
      last_verified_at: new Date().toISOString()
    };

    const { error: addressError } = await supabase
      .from("addresses")
      .insert(addressData);

    if (addressError) throw addressError;

    toast.success("Campaign details saved successfully");
    onSuccess();
  } catch (error) {
    console.error('Error in campaign details submission:', error);
    if (error instanceof Error) {
      toast.error(`Failed to save campaign details: ${error.message}`);
    } else {
      toast.error("Failed to save campaign details. Please try again.");
    }
  }
};