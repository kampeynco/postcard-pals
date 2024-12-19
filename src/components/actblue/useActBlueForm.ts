import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, FormValues } from "./types";
import type { Database } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

export const useActBlueForm = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "",
      committee_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
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
        user_id: user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(insertData);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "ActBlue account settings saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save ActBlue account settings. Please try again.",
      });
    }
  };

  return {
    form,
    committeeType,
    onSubmit,
  };
};