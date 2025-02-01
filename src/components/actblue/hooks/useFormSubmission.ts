import { supabase } from "@/integrations/supabase/client";
import { ActBlueFormData, convertToSubmissionAddress, isCandidateForm } from "@/types/actblue";
import { toast } from "sonner";

export const useFormSubmission = () => {
  const submitForm = async (values: ActBlueFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No authenticated user found");
        return false;
      }

      const submissionAddress = convertToSubmissionAddress(values.address);

      const { error } = await supabase
        .from("actblue_accounts")
        .insert({
          legal_committee_name: values.legal_committee_name,
          organization_name: values.organization_name,
          committee_type: values.committee_type,
          candidate_first_name: isCandidateForm(values) ? values.candidate_first_name : null,
          candidate_middle_name: isCandidateForm(values) ? values.candidate_middle_name : null,
          candidate_last_name: isCandidateForm(values) ? values.candidate_last_name : null,
          candidate_suffix: isCandidateForm(values) ? values.candidate_suffix : null,
          office_sought: isCandidateForm(values) ? values.office_sought : null,
          street_address: submissionAddress.street1,
          city: submissionAddress.city,
          state: submissionAddress.state,
          zip_code: submissionAddress.zip_code,
          disclaimer_text: values.disclaimer_text,
          user_id: user.id,
        });

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