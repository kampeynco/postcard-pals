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
import { FormValues, formSchema, officeOptions, committeeTypes } from "./types";
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
              <FormLabel>Committee Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter committee name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="committee_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Committee Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select committee type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {committeeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "candidate" ? "Candidate Committee" :
                       type === "political_action_committee" ? "Political Action Committee" :
                       "Non-Profit Organization"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {committeeType === "candidate" && (
          <>
            <FormField
              control={form.control}
              name="candidate_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter candidate name" {...field} />
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
                  <FormLabel>Office Sought</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
          </>
        )}

        <FormField
          control={form.control}
          name="disclaimer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Disclaimer</FormLabel>
              <FormControl>
                <Input placeholder="Paid for by..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <AddressVerification onVerified={setVerifiedAddress} />
        </div>

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