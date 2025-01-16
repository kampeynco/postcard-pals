import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommitteeFields } from "./form-fields/CommitteeFields";
import { CandidateFields } from "./form-fields/CandidateFields";
import { DisclaimerField } from "./form-fields/DisclaimerField";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useState } from "react";
import { useOnboarding } from '@/components/onboarding/hooks/useOnboarding';
import { toast } from "sonner";
import { FormValues } from "./types";

const formatPhoneNumber = (value: string) => {
  const number = value.replace(/[^\d]/g, "");
  if (number.length <= 3) return `(${number}`;
  if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

interface CampaignFormProps {
  onSubmit: (values: FormValues, verifiedAddress: any) => Promise<void>;
  defaultValues?: Partial<FormValues>;
}

export const CampaignForm = ({ onSubmit, defaultValues }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { saveOnboardingState } = useOnboarding();

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      committee_name: z.string().min(1, "Committee name is required"),
      committee_type: z.enum(["candidate", "political_action_committee", "non_profit"]),
      candidate_name: z.string().optional(),
      office_sought: z.string().optional(),
      disclaimer_text: z.string().optional(),
      phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
    })),
    defaultValues: {
      committee_name: defaultValues?.committee_name || '',
      committee_type: defaultValues?.committee_type,
      candidate_name: defaultValues?.candidate_name || '',
      office_sought: defaultValues?.office_sought || '',
      disclaimer_text: defaultValues?.disclaimer_text || '',
      phone_number: defaultValues?.phone_number || '',
    }
  });

  const committeeType = form.watch("committee_type");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 10) return;
    const formattedPhone = formatPhoneNumber(value);
    form.setValue('phone_number', formattedPhone);
  };

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await onSubmit(values, verifiedAddress);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <CommitteeFields form={form} />
      {committeeType === 'candidate' && <CandidateFields form={form} />}
      <DisclaimerField form={form} />
      <AddressVerification onVerified={setVerifiedAddress} />
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input 
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                onChange={handlePhoneChange}
                value={field.value}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  );
};