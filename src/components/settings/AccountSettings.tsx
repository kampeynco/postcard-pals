import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommitteeSection } from "../onboarding/form/CommitteeSection";
import { CampaignSection } from "../onboarding/form/CampaignSection";
import { AddressSection } from "../onboarding/form/AddressSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

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
    mode: "onChange",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          toast.error("Please sign in to view settings");
          return;
        }

        const { data, error } = await supabase
          .from("actblue_accounts")
          .select("*")
          .eq("user_id", session.session.user.id)
          .single();

        if (error) {
          console.error("Error loading settings:", error);
          toast.error("Failed to load settings");
          return;
        }

        if (data) {
          form.reset({
            legal_committee_name: data.legal_committee_name,
            organization_name: data.organization_name || "",
            committee_type: data.committee_type,
            candidate_first_name: data.candidate_first_name || "",
            candidate_middle_name: data.candidate_middle_name || "",
            candidate_last_name: data.candidate_last_name || "",
            candidate_suffix: data.candidate_suffix,
            office_sought: data.office_sought || undefined,
            street_address: data.street_address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            disclaimer_text: data.disclaimer_text,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
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
        .update({
          legal_committee_name: values.legal_committee_name,
          organization_name: values.organization_name,
          committee_type: values.committee_type,
          candidate_first_name: values.candidate_first_name,
          candidate_middle_name: values.candidate_middle_name,
          candidate_last_name: values.candidate_last_name,
          candidate_suffix: values.candidate_suffix,
          office_sought: values.office_sought,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          disclaimer_text: values.disclaimer_text,
        })
        .eq("user_id", session.session.user.id);

      if (error) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings");
        return;
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommitteeSection form={form} />
        <CampaignSection />
        <AddressSection form={form} />

        <Button 
          type="submit" 
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}