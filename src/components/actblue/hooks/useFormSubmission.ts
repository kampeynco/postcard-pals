import { supabase } from "@/integrations/supabase/client";
import { FormValues, isCandidateForm, convertToSubmissionAddress } from "@/types/actblue";
import { toast } from "sonner";

export const useFormSubmission = () => {
  const submitForm = async (values: FormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No authenticated user found");
        return false;
      }

      const submissionAddress = convertToSubmissionAddress({
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code
      });

      const baseData = {
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name,
        committee_type: values.committee_type,
        street_address: submissionAddress.street1,
        city: submissionAddress.city,
        state: submissionAddress.state,
        zip_code: submissionAddress.zip_code,
        disclaimer_text: values.disclaimer_text,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(isCandidateForm(values) 
          ? {
              ...baseData,
              candidate_first_name: values.candidate_first_name,
              candidate_middle_name: values.candidate_middle_name,
              candidate_last_name: values.candidate_last_name,
              candidate_suffix: values.candidate_suffix,
              office_sought: values.office_sought,
            }
          : baseData
        );

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to create ActBlue account");
        return false;
      }

      toast.success("ActBlue account created successfully!");
      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create ActBlue account");
      return false;
    }
  };

  return { submitForm };
};