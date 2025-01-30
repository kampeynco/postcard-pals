import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "../types";
import { useFormSubmission } from "./useFormSubmission";
import { useState, useEffect } from "react";
import { validateStep } from "../utils/validation";
import { getTotalSteps } from "../types/form-steps";

interface UseActBlueFormProps {
  onSuccess?: () => void;
}

export const useActBlueForm = ({ onSuccess }: UseActBlueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
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
  const totalSteps = getTotalSteps(committeeType);
  const { submitForm } = useFormSubmission();

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  const handleSubmit = async (values: FormValues) => {
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

  const handleNext = async () => {
    const isValid = await validateStep(form, currentStep, committeeType);
    
    if (isValid) {
      if (currentStep === totalSteps) {
        await handleSubmit(form.getValues());
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    form,
    committeeType,
    currentStep,
    totalSteps,
    isLoading,
    handleNext,
    handleBack,
  };
};