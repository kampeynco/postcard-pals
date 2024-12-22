import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { AddressVerification } from "@/components/address/AddressVerification";

const formSchema = z.object({
  committee_name: z.string().min(2, "Campaign name must be at least 2 characters"),
  office_sought: z.string().min(2, "Office sought must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CampaignDetailsStepProps {
  onNext: () => void;
}

export const CampaignDetailsStep = ({ onNext }: CampaignDetailsStepProps) => {
  const { session } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: "",
      office_sought: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from("actblue_accounts")
        .insert({
          committee_name: values.committee_name,
          office_sought: values.office_sought,
          committee_type: "candidate",
          user_id: session?.user.id,
          disclaimer_text: "Paid for by " + values.committee_name,
          street_address: "",
          city: "",
          state: "",
          zip_code: "",
          is_created: true // Set is_created to true when campaign details are saved
        });

      if (error) throw error;

      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      toast.error("Failed to save campaign details");
    }
  };

  const handleAddressVerified = async (verifiedAddress: any) => {
    try {
      const { error } = await supabase
        .from("actblue_accounts")
        .update({
          street_address: verifiedAddress.street,
          city: verifiedAddress.city,
          state: verifiedAddress.state,
          zip_code: verifiedAddress.zip_code,
        })
        .eq("user_id", session?.user.id);

      if (error) throw error;
      toast.success("Address verified and saved");
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Campaign Details</h2>
        <p className="text-gray-500 text-sm">Tell us about your campaign</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="committee_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Legal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign name" {...field} />
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
                <FormControl>
                  <Input placeholder="Enter office sought" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Office Address</h3>
            <AddressVerification onVerified={handleAddressVerified} />
          </div>

          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </Form>
    </div>
  );
};