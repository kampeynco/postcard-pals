import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AccountSettings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legal_committee_name: "",
      organization_name: "",
      committee_type: "candidate",
      candidate_first_name: "",
      candidate_middle_name: "",
      candidate_last_name: "",
      candidate_suffix: null,
      office_sought: undefined,
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;

      const { data, error } = await supabase
        .from("actblue_accounts")
        .select("*")
        .eq("user_id", session.session.user.id)
        .single();

      if (error) {
        console.error("Error loading settings:", error);
        return;
      }

      if (data) {
        form.reset({
          legal_committee_name: data.legal_committee_name,
          organization_name: data.organization_name,
          committee_type: data.committee_type,
          candidate_first_name: data.candidate_first_name || "",
          candidate_middle_name: data.candidate_middle_name || "",
          candidate_last_name: data.candidate_last_name || "",
          candidate_suffix: data.candidate_suffix || null,
          office_sought: data.office_sought || undefined,
          street_address: data.street_address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          disclaimer_text: data.disclaimer_text,
        });
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          ...values,
          user_id: session.session.user.id,
        });

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="legal_committee_name">Legal Committee Name</label>
          <input {...form.register("legal_committee_name")} />
        </div>
        <div>
          <label htmlFor="organization_name">Organization Name</label>
          <input {...form.register("organization_name")} />
        </div>
        <div>
          <label htmlFor="committee_type">Committee Type</label>
          <select {...form.register("committee_type")}>
            <option value="candidate">Candidate</option>
            <option value="political_action_committee">Political Action Committee</option>
            <option value="non_profit">Non-Profit</option>
          </select>
        </div>
        <div>
          <label htmlFor="candidate_first_name">Candidate First Name</label>
          <input {...form.register("candidate_first_name")} />
        </div>
        <div>
          <label htmlFor="candidate_middle_name">Candidate Middle Name</label>
          <input {...form.register("candidate_middle_name")} />
        </div>
        <div>
          <label htmlFor="candidate_last_name">Candidate Last Name</label>
          <input {...form.register("candidate_last_name")} />
        </div>
        <div>
          <label htmlFor="candidate_suffix">Candidate Suffix</label>
          <input {...form.register("candidate_suffix")} />
        </div>
        <div>
          <label htmlFor="office_sought">Office Sought</label>
          <input {...form.register("office_sought")} />
        </div>
        <div>
          <label htmlFor="street_address">Street Address</label>
          <input {...form.register("street_address")} />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input {...form.register("city")} />
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input {...form.register("state")} />
        </div>
        <div>
          <label htmlFor="zip_code">ZIP Code</label>
          <input {...form.register("zip_code")} />
        </div>
        <div>
          <label htmlFor="disclaimer_text">Disclaimer Text</label>
          <textarea {...form.register("disclaimer_text")} />
        </div>
        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
