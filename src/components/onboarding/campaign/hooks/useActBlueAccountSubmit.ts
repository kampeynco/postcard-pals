import { supabase } from "@/integrations/supabase/client";
import { ActBlueFormData } from "@/components/actblue/types/form";
import { toast } from "sonner";

export const useActBlueAccountSubmit = () => {
  const submitActBlueAccount = async (values: ActBlueFormData, userId: string, address: { 
    street: string;
    city: string;
    state: string;
    zip_code: string;
  }): Promise<string> => {
    try {
      const insertData = {
        user_id: userId,
        legal_committee_name: values.legal_committee_name || "",
        organization_name: values.organization_name || "",
        committee_type: values.committee_type || "candidate",
        ...(values.committee_type === "candidate" ? {
          candidate_first_name: values.candidate_first_name || "",
          candidate_middle_name: values.candidate_middle_name || "",
          candidate_last_name: values.candidate_last_name || "",
          candidate_suffix: values.candidate_suffix || null,
          office_sought: values.office_sought || null,
        } : {
          candidate_first_name: null,
          candidate_middle_name: null,
          candidate_last_name: null,
          candidate_suffix: null,
          office_sought: null,
        }),
        street_address: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        disclaimer_text: values.disclaimer_text || "",
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
    } catch (error) {
      console.error("Error submitting ActBlue account:", error);
      toast.error("Failed to save ActBlue account");
      throw error;
    }
  };

  return { submitActBlueAccount };
};