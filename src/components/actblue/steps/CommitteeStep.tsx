import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { CommitteeTypeField } from "../CommitteeTypeField";
import { CommitteeNameField } from "../CommitteeNameField";
import { CandidateFields } from "../CandidateFields";

interface CommitteeStepProps {
  form: UseFormReturn<FormValues>;
  committeeType: string;
}

export function CommitteeStep({ form, committeeType }: CommitteeStepProps) {
  return (
    <div className="space-y-6">
      <CommitteeTypeField form={form} />
      <CommitteeNameField form={form} />
      {committeeType === "candidate" && <CandidateFields />}
    </div>
  );
}