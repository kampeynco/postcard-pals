import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { AddressFields } from "../AddressFields";

interface AddressStepProps {
  form: UseFormReturn<FormValues>;
}

export function AddressStep({ form }: AddressStepProps) {
  return <AddressFields form={form} />;
}