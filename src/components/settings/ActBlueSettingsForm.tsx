import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CommitteeTypeField } from "@/components/actblue/CommitteeTypeField";
import { CommitteeNameField } from "@/components/actblue/CommitteeNameField";
import { CandidateFields } from "@/components/actblue/CandidateFields";
import { AddressFields } from "@/components/actblue/AddressFields";
import { DisclaimerField } from "@/components/actblue/DisclaimerField";
import { FormValues, formSchema } from "@/components/actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/Auth";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ActBlueSettingsForm() {
  const { session } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      committee_name: "",
      candidate_name: "",
      office_sought: undefined,
      disclaimer_text: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  const committeeType = form.watch("committee_type");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadActBlueData = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("actblue_accounts")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;
        if (data) {
          form.reset({
            committee_name: data.committee_name,
            committee_type: data.committee_type,
            candidate_name: data.candidate_name || "",
            office_sought: data.office_sought || undefined,
            disclaimer_text: data.disclaimer_text,
            street_address: data.street_address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
          });
        }
      } catch (error) {
        console.error("Error loading ActBlue data:", error);
        toast.error("Failed to load ActBlue settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadActBlueData();
  }, [session?.user?.id, form]);

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          committee_name: values.committee_name,
          committee_type: values.committee_type,
          candidate_name: values.candidate_name,
          office_sought: values.office_sought,
          disclaimer_text: values.disclaimer_text,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          user_id: session.user.id,
        });

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <CommitteeTypeField form={form} />
          <CommitteeNameField form={form} />
          {committeeType === "candidate" && <CandidateFields />}
          <DisclaimerField form={form} />
          <AddressFields form={form} />
        </div>

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </form>
    </Form>
  );
}