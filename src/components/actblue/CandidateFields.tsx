import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./types";
import { NameFields } from "./candidate/NameFields";
import { LastNameFields } from "./candidate/LastNameFields";
import { OfficeSoughtField } from "./candidate/OfficeSoughtField";

export const CandidateFields = memo(() => {
  const form = useFormContext<FormValues>();
  const showFields = form.watch("committee_type") === "candidate";

  if (!showFields) return null;

  return (
    <div className="space-y-4">
      <NameFields />
      <LastNameFields />
      <OfficeSoughtField />
    </div>
  );
});

CandidateFields.displayName = 'CandidateFields';