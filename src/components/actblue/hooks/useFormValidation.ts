import { FormValues } from "@/types/actblue";
import { UseFormReturn } from "react-hook-form";
import { getStepFields } from "../types/form-steps";

export const useFormValidation = (form: UseFormReturn<FormValues>) => {
  const validateStep = async (step: number, committeeType: string) => {
    const fields = getStepFields(step, committeeType);
    return await form.trigger(fields);
  };

  return { validateStep };
};