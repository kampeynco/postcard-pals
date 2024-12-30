import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "../../hooks/useOnboarding";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddressInput } from "@/components/address/types";

const formSchema = z.object({
  committee_name: z.string().min(1, "Committee name is required"),
  committee_type: z.string().min(1, "Committee type is required"),
  candidate_name: z.string().optional(),
  office_sought: z.string().optional(),
  disclaimer_text: z.string().optional(),
});

export const useCampaignForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_name: "",
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "",
      disclaimer_text: "",
    },
  });

  const onSubmit = async (data: any, verifiedAddress: AddressInput | null) => {
    try {
      const { error } = await supabase.from("actblue_accounts").insert({
        ...data,
        address: verifiedAddress,
      });

      if (error) throw error;

      toast.success("Campaign details saved successfully!");
    } catch (error) {
      console.error("Error saving campaign details:", error);
      toast.error("Failed to save campaign details. Please try again.");
    }
  };

  return {
    form,
    onSubmit,
  };
};