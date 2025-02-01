import { GroupCard } from "../GroupCard";
import { CandidateFields } from "@/components/actblue/CandidateFields";
import { useFormContext } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

export const CampaignSection = () => {
  const form = useFormContext<FormValues>();
  const committeeType = form.watch("committee_type");

  if (committeeType !== "candidate") return null;

  return (
    <GroupCard 
      title="Campaign Details"
      description="Provide specific information about your campaign, including candidate name and the office being sought."
    >
      <CandidateFields />
    </GroupCard>
  );
};