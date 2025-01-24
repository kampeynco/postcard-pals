import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CampaignFormFields } from "./CampaignFormFields";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useOnboarding } from '@/components/onboarding/hooks/useOnboarding';
import { toast } from "sonner";
import { FormValues, formSchema } from "./types";

interface CampaignFormProps {
  onSubmit: (values: FormValues, verifiedAddress: any) => Promise<void>;
  defaultValues?: Partial<FormValues>;
}

export const CampaignForm = ({ onSubmit, defaultValues }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {}
  });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CampaignFormFields form={form} />
        <AddressVerification onVerified={setVerifiedAddress} />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
};