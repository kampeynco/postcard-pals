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
          ? ['committee_type', 'legal_committee_name', 'organization_name', 'candidate_first_name', 'candidate_last_name', 'candidate_middle_name', 'candidate_suffix', 'office_sought']
          : ['committee_type', 'legal_committee_name', 'organization_name'];
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