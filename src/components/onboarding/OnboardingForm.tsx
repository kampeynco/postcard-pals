import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema, isCandidateForm } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CommitteeSection } from "./form/CommitteeSection";
import { CampaignSection } from "./form/CampaignSection";
import { AddressSection } from "./form/AddressSection";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      legal_committee_name: "",
      organization_name: "",
      candidate_first_name: "",
      candidate_middle_name: "",
      candidate_last_name: "",
      candidate_suffix: null,
      office_sought: undefined,
      disclaimer_text: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      const baseData = {
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name,
        committee_type: values.committee_type,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
        user_id: session.session.user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(isCandidateForm(values) 
          ? {
              ...baseData,
              candidate_first_name: values.candidate_first_name,
              candidate_middle_name: values.candidate_middle_name,
              candidate_last_name: values.candidate_last_name,
              candidate_suffix: values.candidate_suffix,
              office_sought: values.office_sought,
            }
          : baseData
        );

      if (error) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings");
        return;
      }

      toast.success("Settings saved successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CommitteeSection form={form} />
        <CampaignSection />
        <AddressSection form={form} />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            'Save'
          )}
        </Button>
      </form>
    </Form>
  );
}