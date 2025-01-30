import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../types";
import { toast } from "sonner";

export const useFormSubmission = () => {
  const submitForm = async (values: FormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase
        .from("actblue_accounts")
        .insert({
          committee_name: values.committee_name,
          committee_type: values.committee_type,
          candidate_name: values.candidate_name || null,
          office_sought: values.office_sought || null,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          disclaimer_text: values.disclaimer_text,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success("ActBlue account created successfully!");
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create ActBlue account");
      return false;
    }
  };

  return { submitForm };
};