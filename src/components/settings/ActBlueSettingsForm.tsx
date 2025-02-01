import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ActBlueSettingsForm() {
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
        <Card className="p-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="legal_committee_name"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Legal Committee Name</Label>
                  <Input {...field} placeholder="Enter legal committee name" />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="committee_type"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Committee Type</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <option value="candidate">Candidate Committee</option>
                    <option value="political_action_committee">Political Action Committee</option>
                    <option value="non_profit">Non-Profit</option>
                  </Select>
                </div>
              )}
            />

            {form.watch("committee_type") === "candidate" && (
              <>
                <FormField
                  control={form.control}
                  name="candidate_first_name"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Candidate First Name</Label>
                      <Input {...field} placeholder="Enter first name" />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="candidate_last_name"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Candidate Last Name</Label>
                      <Input {...field} placeholder="Enter last name" />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="office_sought"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label>Office Sought</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <option value="">Select office</option>
                        <option value="U.S. President">U.S. President</option>
                        <option value="U.S. Senator">U.S. Senator</option>
                        <option value="U.S. Representative">U.S. Representative</option>
                        <option value="Governor">Governor</option>
                        <option value="State Senator">State Senator</option>
                        <option value="State Representative">State Representative</option>
                      </Select>
                    </div>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input {...field} placeholder="Enter street address" />
                </div>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input {...field} placeholder="City" />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input {...field} placeholder="State" maxLength={2} />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>ZIP Code</Label>
                    <Input {...field} placeholder="ZIP code" />
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="disclaimer_text"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Disclaimer Text</Label>
                  <Textarea {...field} placeholder="Enter disclaimer text" />
                </div>
              )}
            />
          </div>
        </Card>

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </Form>
  );
}