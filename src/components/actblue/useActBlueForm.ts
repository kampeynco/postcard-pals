import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, FormValues, OfficeType } from "./types";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

interface UseActBlueFormProps {
  onSuccess?: () => void;
}

export const useActBlueForm = ({ onSuccess }: UseActBlueFormProps = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "U.S. Representative" as OfficeType,
      committee_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("actblue_accounts")
          .select("*")
          .eq("user_id", session.session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching ActBlue account:", error);
          toast.error("Failed to load ActBlue account data");
          return;
        }

        if (data) {
          form.reset({
            committee_type: data.committee_type,
            committee_name: data.committee_name,
            candidate_name: data.candidate_name || "",
            office_sought: (data.office_sought as OfficeType) || "U.S. Representative",
            street_address: data.street_address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            disclaimer_text: data.disclaimer_text,
          });
        }
      } catch (error) {
        console.error("Error in loadExistingData:", error);
        toast.error("Failed to load existing data");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
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
        user_id: session.user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .upsert(insertData)
        .select()
        .maybeSingle();
      
      if (error) throw error;

      toast.success("ActBlue account settings saved successfully");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving ActBlue account:", error);
      toast.error("Failed to save ActBlue account settings. Please try again.");
    }
  };

  return {
    form,
    committeeType,
    onSubmit,
    isLoading,
  };
};