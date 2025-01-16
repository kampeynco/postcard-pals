import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CampaignFormFields } from "./CampaignFormFields";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useOnboarding } from '@/components/onboarding/hooks/useOnboarding';
import { toast } from "sonner";
import { FormValues, formSchema } from "./types";

interface CampaignFormProps {
  onSubmit: (values: FormValues, verifiedAddress: any) => Promise<void>;
  defaultValues?: Partial<FormValues>;
}

const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const number = value.replace(/[^\d]/g, "");
  
  // Format the number as (XXX) XXX-XXXX
  if (number.length <= 3) return number ? `(${number}` : "";
  if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

export const CampaignForm = ({ onSubmit, defaultValues }: CampaignFormProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {}
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 10) return; // Prevent more than 10 digits
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CampaignFormFields form={form} />
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
                  value={field.value || ''}
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
    </Form>
  );
};