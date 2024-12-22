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

interface CampaignFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onAddressVerified: (address: any) => Promise<void>;
}

export const CampaignForm = ({ onSubmit, onAddressVerified }: CampaignFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: "",
      office_sought: "U.S. Representative",
    },
  });

  return (
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Office Address</h3>
          <AddressVerification onVerified={onAddressVerified} />
        </div>

        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </Form>
  );
};