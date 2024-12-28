import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../types";
import { OnboardingData } from "../../hooks/useOnboardingState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCampaignForm = (onNext: () => void, defaultValues?: OnboardingData) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: defaultValues?.committee_name || "",
      committee_type: defaultValues?.committee_type as any || "candidate",
      candidate_name: defaultValues?.candidate_name || "",
      office_sought: defaultValues?.office_sought as any || undefined,
      disclaimer_text: defaultValues?.disclaimer_text || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        return;
      }

      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          user_id: session.user.id,
          committee_name: values.committee_name,
          committee_type: values.committee_type,
          candidate_name: values.candidate_name,
          office_sought: values.office_sought,
          disclaimer_text: values.disclaimer_text,
          is_created: true
        });

      if (error) throw error;

      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      console.error("Error saving campaign details:", error);
      toast.error("Failed to save campaign details");
    }
  };

  return {
    form,
    onSubmit,
  };
};