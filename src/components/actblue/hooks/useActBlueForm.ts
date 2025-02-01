import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "../types";
import { useFormSubmission } from "./useFormSubmission";
import { useState } from "react";

interface UseActBlueFormProps {
  onSuccess?: () => void;
}

export const useActBlueForm = ({ onSuccess }: UseActBlueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legal_committee_name: "",
      organization_name: "",
      committee_type: "candidate",
      candidate_first_name: "",
      candidate_middle_name: "",
      candidate_last_name: "",
      candidate_suffix: null,
      office_sought: undefined,
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");
  const { submitForm } = useFormSubmission();

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const formattedValues = {
        ...values,
        address: {
          street: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
        },
      };
      const success = await submitForm(formattedValues);
      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    committeeType,
    onSubmit,
    isLoading,
  };
};