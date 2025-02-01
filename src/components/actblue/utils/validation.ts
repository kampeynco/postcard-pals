import { FormValues } from "../types";
import { UseFormReturn } from "react-hook-form";
import { getStepFields } from "../types/form-steps";

export const validateStep = async (
  form: UseFormReturn<FormValues>,
  step: number,
  committeeType: string
): Promise<boolean> => {
  const fields = getStepFields(step, committeeType);
  return await form.trigger(fields as Array<keyof FormValues>);
};

export const getStepErrors = (
  form: UseFormReturn<FormValues>,
  step: number,
  committeeType: string
): Record<string, string> => {
  const fields = getStepFields(step, committeeType);
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const fieldError = form.formState.errors[field as keyof FormValues];
    if (fieldError?.message) {
      errors[field] = fieldError.message as string;
    }
  });

  return errors;
};