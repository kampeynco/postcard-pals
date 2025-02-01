import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActBlueFormData } from "@/types/actblue";
import { formSchema } from "../types";
import { useFormSubmission } from "./useFormSubmission";
import { useState } from "react";

interface UseActBlueFormProps {
  onSuccess?: () => void;
}

export const useActBlueForm = ({ onSuccess }: UseActBlueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ActBlueFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legal_committee_name: "",
      organization_name: "",
      committee_type: "candidate",
      candidate_first_name: "",
      candidate_middle_name: "",
      candidate_last_name: "",
      candidate_suffix: undefined,
      office_sought: undefined,
      address: {
        street: "",
        city: "",
        state: "",
        zip_code: ""
      },
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");
  const { submitForm } = useFormSubmission();

  const onSubmit = async (values: ActBlueFormData) => {
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