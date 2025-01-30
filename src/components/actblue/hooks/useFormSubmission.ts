import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../types";
import { toast } from "sonner";

export const useFormSubmission = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("actblue_accounts").insert({
        user_id: user.id,
        ...values,
      });

      if (error) throw error;

      toast.success("ActBlue account created successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create ActBlue account");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
};