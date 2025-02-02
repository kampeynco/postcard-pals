import { supabase } from "@/integrations/supabase/client";
import { FormValues, isCandidateForm } from "@/components/actblue/types";
import { toast } from "sonner";

export const useActBlueAccountSubmit = () => {
  const submitActBlueAccount = async (values: FormValues, userId: string) => {
    try {
      const baseData = {
        user_id: userId,
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name || "",
        committee_type: values.committee_type,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
        is_created: true,
        is_onboarded: false,
        is_active: false,
      };

      const insertData = isCandidateForm(values)
        ? {
            ...baseData,
            candidate_first_name: values.candidate_first_name,
            candidate_middle_name: values.candidate_middle_name || "",
            candidate_last_name: values.candidate_last_name,
            candidate_suffix: values.candidate_suffix,
            office_sought: values.office_sought,
          }
        : {
            ...baseData,
            candidate_first_name: null,
            candidate_middle_name: null,
            candidate_last_name: null,
            candidate_suffix: null,
            office_sought: null,
          };

      const { data, error } = await supabase
        .from("actblue_accounts")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Failed to create ActBlue account");
      
      return data.id;
    } catch (error) {
      console.error("Error submitting ActBlue account:", error);
      toast.error("Failed to save ActBlue account");
      throw error;
    }
  };

  return { submitActBlueAccount };
};