import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CommitteeTypeField } from "./CommitteeTypeField";
import { CandidateFields } from "./CandidateFields";
import { AddressFields } from "./AddressFields";
import { formSchema, FormValues } from "./types";
import type { Database } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export default function ActBlueAccountForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "",
      committee_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");

  async function onSubmit(values: FormValues) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const insertData: ActBlueAccount = {
        committee_type: values.committee_type,
        committee_name: values.committee_name,
        candidate_name: values.candidate_name,
        office_sought: values.office_sought,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(insertData);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "ActBlue account settings saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save ActBlue account settings. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommitteeTypeField form={form} />

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

        {committeeType === "candidate" && <CandidateFields form={form} />}

        <AddressFields form={form} />

        <FormField
          control={form.control}
          name="disclaimer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disclaimer Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter disclaimer text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save ActBlue Settings</Button>
      </form>
    </Form>
  );
}