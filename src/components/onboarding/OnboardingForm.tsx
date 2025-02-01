import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GroupCard } from "./GroupCard";
import { CommitteeTypeField } from "../actblue/CommitteeTypeField";
import { CommitteeNameField } from "../actblue/CommitteeNameField";
import { CandidateFields } from "../actblue/CandidateFields";
import { AddressFields } from "../actblue/AddressFields";
import { FormValues, formSchema } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Validate all fields
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = Object.keys(form.formState.errors);
        if (errors.length > 0) {
          toast.error(`Please fill in all required fields: ${errors.join(", ")}`);
        }
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      // Get existing record first
      const { data: existingData } = await supabase
        .from("actblue_accounts")
        .select("*")
        .eq("user_id", session.session.user.id)
        .single();

      // Prepare data for upsert
      const updateData = {
        ...(existingData || {}),
        user_id: session.session.user.id,
        committee_type: values.committee_type,
        committee_name: values.committee_name,
        candidate_name: values.committee_type === "candidate" ? values.candidate_name : null,
        office_sought: values.committee_type === "candidate" ? values.office_sought : null,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .upsert(updateData);

      if (error) throw error;
      toast.success("Settings saved successfully");
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
        <GroupCard title="Committee Details">
          <div className="space-y-4">
            <CommitteeTypeField form={form} />
            <CommitteeNameField form={form} />
          </div>
        </GroupCard>

        {committeeType === "candidate" && (
          <GroupCard title="Campaign Details">
            <CandidateFields />
          </GroupCard>
        )}

        <GroupCard title="Verify Committee Address">
          <AddressFields form={form} />
        </GroupCard>

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
            'Save All Settings'
          )}
        </Button>
      </form>
    </Form>
  );
}