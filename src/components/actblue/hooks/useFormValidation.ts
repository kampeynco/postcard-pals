import { FormValues } from "../types";
import { UseFormReturn } from "react-hook-form";

export const useFormValidation = (form: UseFormReturn<FormValues>) => {
  const validateStep = async (step: number, committeeType: string) => {
    const fields = getFieldsForStep(step, committeeType);
    return await form.trigger(fields);
  };

  const getFieldsForStep = (step: number, committeeType: string): Array<keyof FormValues> => {
    switch (step) {
      case 1:
        return committeeType === 'candidate' 
          ? ['committee_type', 'committee_name', 'candidate_name', 'office_sought']
          : ['committee_type', 'committee_name'];
      case 2:
        return ['street_address', 'city', 'state', 'zip_code'];
      case 3:
        return ['disclaimer_text'];
      default:
        return [];
    }
  };

  return { validateStep };
};