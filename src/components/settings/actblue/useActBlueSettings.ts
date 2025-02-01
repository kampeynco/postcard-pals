import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "@/components/actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useActBlueSettings = () => {
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

        if (error) throw error;

        if (data) {
          form.reset({
            legal_committee_name: data.legal_committee_name,
            organization_name: data.organization_name || "",
            committee_type: data.committee_type as "candidate" | "organization",
            ...(data.committee_type === "candidate" ? {
              candidate_first_name: data.candidate_first_name || "",
              candidate_middle_name: data.candidate_middle_name || "",
              candidate_last_name: data.candidate_last_name || "",
              candidate_suffix: data.candidate_suffix,
              office_sought: data.office_sought as FormValues["office_sought"],
            } : {}),
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

      const updateData = {
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name,
        committee_type: values.committee_type,
        ...(values.committee_type === "candidate" ? {
          candidate_first_name: values.candidate_first_name,
          candidate_middle_name: values.candidate_middle_name,
          candidate_last_name: values.candidate_last_name,
          candidate_suffix: values.candidate_suffix,
          office_sought: values.office_sought,
        } : {
          candidate_first_name: null,
          candidate_middle_name: null,
          candidate_last_name: null,
          candidate_suffix: null,
          office_sought: null,
        }),
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .update(updateData)
        .eq("user_id", session.session.user.id);

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return {
    form,
    onSubmit,
  };
};