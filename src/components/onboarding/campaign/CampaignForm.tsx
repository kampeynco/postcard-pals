const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[\\D]/g, "");
    if (number.length <= 3) return [(${number}](cci:1://file:///Users/admin/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/Thanks%20From%20Us/postcard-pals/src/components/onboarding/campaign/CampaignForm.tsx:17:0-58:2);
    if (number.length <= 6) return [(${number.slice(0, 3)}) ${number.slice(3)}](cci:1://file:///Users/admin/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/Thanks%20From%20Us/postcard-pals/src/components/onboarding/campaign/CampaignForm.tsx:17:0-58:2);
    return [(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}](cci:1://file:///Users/admin/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/Thanks%20From%20Us/postcard-pals/src/components/onboarding/campaign/CampaignForm.tsx:17:0-58:2);
};const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    form.setValue('phone_number', formattedPhone);
};<Form.Input
    type="tel"
    label="Phone Number"
    {...form.register('phone_number', { onChange: handlePhoneChange })}
/>import { useForm } from "react-hook-form";
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
  defaultValues?: FormValues;
}

export const CampaignForm = ({ onSubmit, defaultValues }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState<AddressInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {},
  });

  const committeeType = form.watch("committee_type");

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values, verifiedAddress);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[\D]/g, "");
    if (number.length <= 3) return `(${number}`;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    form.setValue('phone_number', formattedPhone);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CommitteeFields form={form} />
        {committeeType === "candidate" && <CandidateFields form={form} />}
        <DisclaimerField form={form} />
        <AddressVerification onVerified={setVerifiedAddress} />
        <Form.Input
          type="tel"
          label="Phone Number"
          {...form.register('phone_number', { onChange: handlePhoneChange })}
        />
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