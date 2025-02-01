import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FormValues, isCandidateForm } from "@/types/actblue";
import type { AddressInput } from "@/components/address/types";

export const useCampaignSubmit = (onNext: () => void) => {
  const handleSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required");
      }

      if (!verifiedAddress) {
        throw new Error("Address verification required");
      }

      const baseData = {
        user_id: user.id,
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name,
        committee_type: values.committee_type,
        street_address: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code,
        disclaimer_text: values.disclaimer_text,
        is_created: true,
      };

      const formData = isCandidateForm(values)
        ? {
            ...baseData,
            candidate_first_name: values.candidate_first_name,
            candidate_middle_name: values.candidate_middle_name,
            candidate_last_name: values.candidate_last_name,
            candidate_suffix: values.candidate_suffix,
            office_sought: values.office_sought,
          }
        : baseData;

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(formData);

      if (error) {
        throw error;
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
      throw error;
    }
  };

  return { handleSubmit };
};