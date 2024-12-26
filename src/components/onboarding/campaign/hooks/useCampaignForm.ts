import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from "@/hooks/useToastNotifications";
import { useAuth } from "@/components/auth/AuthProvider";

export const useCampaignForm = (onNext: () => void) => {
  const { session } = useAuth();
  const { showSuccess, showError } = useToastNotifications();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: "",
      committee_type: "candidate",
      candidate_name: "",
      office_sought: undefined,
      disclaimer_text: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase
        .from("actblue_accounts")
        .update({
          committee_name: values.committee_name,
          committee_type: values.committee_type,
          candidate_name: values.candidate_name || null,
          office_sought: values.office_sought || null,
          disclaimer_text: values.disclaimer_text,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      showSuccess("Campaign details updated successfully");
      onNext();
    } catch (error) {
      showError(error);
    }
  };

  return {
    form,
    onSubmit,
  };
};