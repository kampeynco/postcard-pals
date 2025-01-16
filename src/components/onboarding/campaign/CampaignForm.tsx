import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommitteeFields } from "./form-fields/CommitteeFields";
import { CandidateFields } from "./form-fields/CandidateFields";
import { DisclaimerField } from "./form-fields/DisclaimerField";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useState } from "react";
import { useOnboarding } from '@/components/onboarding/hooks/useOnboarding';

interface FormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  committee_name?: string;
  committee_type?: string;
  candidate_name?: string;
  office_sought?: string;
  disclaimer_text?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^[\(]\d{3}[\)] \d{3}-\d{4}$/, "Invalid phone number format"),
});

const formatPhoneNumber = (value: string) => {
  const number = value.replace(/[^\d]/g, "");
  if (number.length <= 3) return `(${number}`;
  if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

interface CampaignFormProps {
  onSubmit: (values: FormValues, verifiedAddress: any) => Promise<void>;
  defaultValues?: FormValues;
}

export const CampaignForm = ({ onSubmit, defaultValues }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { saveOnboardingState, currentStep } = useOnboarding();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: defaultValues?.first_name || '',
      last_name: defaultValues?.last_name || '',
      phone_number: defaultValues?.phone_number || '',
    },
  });

  const committeeType = form.watch("committee_type");

  const handlePhoneChange = (e: any) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
    if (value.length > 10) return; // Prevent more than 10 digits
    const formattedPhone = formatPhoneNumber(value);
    form.setValue('phone_number', formattedPhone);
  };

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log('Submitting form with values:', values);
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (!verifiedAddress) {
        throw new Error('Please verify your address before submitting');
      }
      await saveOnboardingState(values, currentStep);
      await onSubmit(values, verifiedAddress);
    } catch (error) {
      console.error('Form submission error:', error);
      form.setError('root', {
        type: 'submit',
        message: error instanceof Error ? error.message : 'An error occurred while submitting the form',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(handleSubmit)}>
      {console.log('Rendering CampaignForm with committeeType:', committeeType)}
      {console.log('Form values:', form.getValues())}
      <CommitteeFields form={form} />
      {committeeType === "candidate" && <CandidateFields form={form} />}
      <DisclaimerField form={form} />
      <AddressVerification onVerified={setVerifiedAddress} />
      <Form.Input
        type="tel"
        label="Phone Number"
        onChange={handlePhoneChange}
        value={form.watch('phone_number') || ''}
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </Form>
  );
};