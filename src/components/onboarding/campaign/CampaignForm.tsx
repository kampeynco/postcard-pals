import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommitteeFields } from "./form-fields/CommitteeFields";
import { CandidateFields } from "./form-fields/CandidateFields";
import { DisclaimerField } from "./form-fields/DisclaimerField";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useState } from "react";
import { FormValues, formSchema } from "./types";
import type { AddressInput } from "@/components/address/types";

interface CampaignFormProps {
  onSubmit: (values: FormValues, verifiedAddress: AddressInput | null) => Promise<void>;
}

export const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState<AddressInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: "",
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "U.S. Representative",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values, verifiedAddress);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CommitteeFields form={form} />
        {committeeType === "candidate" && <CandidateFields form={form} />}
        <DisclaimerField form={form} />
        <AddressVerification onVerified={setVerifiedAddress} />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};