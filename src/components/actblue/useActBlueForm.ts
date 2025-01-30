import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "./types";
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
      committee_name: "",
      committee_type: "candidate",
      candidate_name: "",
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
      const success = await submitForm(values);
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