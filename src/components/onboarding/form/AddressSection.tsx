import { GroupCard } from "../GroupCard";
import { AddressFields } from "@/components/actblue/AddressFields";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

interface AddressSectionProps {
  form: UseFormReturn<FormValues>;
}

export const AddressSection = ({ form }: AddressSectionProps) => {
  return (
    <GroupCard 
      title="Committee Address"
      description="Enter your committee's official address. This will be used for compliance and communication purposes."
    >
      <AddressFields form={form} />
    </GroupCard>
  );
};