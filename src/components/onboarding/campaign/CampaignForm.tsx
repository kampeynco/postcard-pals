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

const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return `(${number}`;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

// Handle phone input changes
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    form.setValue('phone_number', formattedPhone);
};

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
    console.log('Submitting form with values:', values); // Debugging statement
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await saveOnboardingState(values, currentStep);
      await onSubmit(values, verifiedAddress);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {console.log('Rendering CampaignForm with committeeType:', committeeType)}
        {console.log('Form values:', form.getValues())} // Log current form values
        <CommitteeFields form={form} />
        {committeeType === "candidate" && <CandidateFields form={form} />}
        <DisclaimerField form={form} />
        <AddressVerification onVerified={setVerifiedAddress} />
        <Form.Input
          type="tel"
          label="Phone Number"
          onChange={(e) => handlePhoneChange(e)}
          {...form.register('phone_number')}
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