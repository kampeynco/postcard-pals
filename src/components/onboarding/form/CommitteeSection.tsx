import { GroupCard } from "../GroupCard";
import { CommitteeTypeField } from "@/components/actblue/CommitteeTypeField";
import { CommitteeNameField } from "@/components/actblue/CommitteeNameField";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

interface CommitteeSectionProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeSection = ({ form }: CommitteeSectionProps) => {
  return (
    <GroupCard 
      title="Committee Details"
      description="Enter your committee's basic information, including the type of committee and official name."
    >
      <div className="space-y-4">
        <CommitteeTypeField form={form} />
        <CommitteeNameField form={form} />
      </div>
    </GroupCard>
  );
};