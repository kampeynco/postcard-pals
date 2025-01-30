import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { DisclaimerField } from "../DisclaimerField";

interface DisclaimerStepProps {
  form: UseFormReturn<FormValues>;
}

export function DisclaimerStep({ form }: DisclaimerStepProps) {
  return <DisclaimerField form={form} />;
}