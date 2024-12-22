import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues, formSchema, officeOptions } from "./types";
import { AddressVerification } from "@/components/address/AddressVerification";
import { useState } from "react";
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
      office_sought: "U.S. Representative",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
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
        <FormField
          control={form.control}
          name="committee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Campaign Legal Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter campaign name" 
                  className="border-gray-200 focus:border-brand-background focus:ring-brand-background" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="office_sought"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Office Sought</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-200 focus:border-brand-background focus:ring-brand-background">
                    <SelectValue placeholder="Select an office" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {officeOptions.map((office) => (
                    <SelectItem key={office} value={office}>
                      {office}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Office Address</h3>
          <AddressVerification onVerified={setVerifiedAddress} />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-brand-background hover:bg-brand-background/90 text-white font-medium py-2.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};