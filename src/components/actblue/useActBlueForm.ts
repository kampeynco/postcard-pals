import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "./types";
import { useFormValidation } from "./hooks/useFormValidation";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { useState } from "react";

interface UseActBlueFormProps {
  onSuccess?: () => void;
}

export const useActBlueForm = ({ onSuccess }: UseActBlueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      committee_name: "",
      candidate_name: "",
      office_sought: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");
  const { validateStep } = useFormValidation(form);
  const { submitForm, isSubmitting } = useFormSubmission(onSuccess);

  const onSubmit = async (values: FormValues) => {
    try {
      await submitForm(values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return {
    form,
    committeeType,
    onSubmit,
    isLoading: isLoading || isSubmitting,
  };
};