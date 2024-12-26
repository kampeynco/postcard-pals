import { supabase } from "@/integrations/supabase/client";
import type { FormValues } from "../types";
import type { Database } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export const useActBlueAccountSubmit = () => {
  const submitActBlueAccount = async (values: FormValues, userId: string, address: { 
    street: string;
    city: string;
    state: string;
    zip_code: string;
  }): Promise<string> => {
    const insertData: ActBlueAccount = {
      user_id: userId,
      committee_name: values.committee_name,
      committee_type: values.committee_type,
      candidate_name: values.committee_type === 'candidate' ? values.candidate_name : null,
      office_sought: values.committee_type === 'candidate' ? values.office_sought : null,
      street_address: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      disclaimer_text: values.disclaimer_text,
      is_created: true,
      is_onboarded: false,
      is_active: false
    };

    const { data: existingAccount, error: fetchError } = await supabase
      .from("actblue_accounts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingAccount) {
      const { data: updated, error: updateError } = await supabase
        .from("actblue_accounts")
        .update(insertData)
        .eq("id", existingAccount.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!updated) throw new Error("Failed to update ActBlue account");
      return existingAccount.id;
    } 

    const { data: created, error: insertError } = await supabase
      .from("actblue_accounts")
      .insert([insertData])
      .select()
      .single();

    if (insertError) throw insertError;
    if (!created) throw new Error("Failed to create ActBlue account");
    return created.id;
  };

  return { submitActBlueAccount };
};