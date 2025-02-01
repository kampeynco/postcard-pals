import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { GroupCard } from "./GroupCard";
import { CommitteeTypeField } from "../actblue/CommitteeTypeField";
import { CommitteeNameField } from "../actblue/CommitteeNameField";
import { CandidateFields } from "../actblue/CandidateFields";
import { AddressFields } from "../actblue/AddressFields";
import { FormValues, formSchema } from "../actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function OnboardingForm() {
  const [isLoadingCommittee, setIsLoadingCommittee] = useState(false);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

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

  const saveCommitteeDetails = async () => {
    try {
      setIsLoadingCommittee(true);
      await form.trigger(["committee_type", "committee_name"]);
      
      if (!form.formState.isValid) {
        toast.error("Please fill in all required committee fields");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      const values = form.getValues();
      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          committee_type: values.committee_type,
          committee_name: values.committee_name,
          user_id: session.session.user.id,
        });

      if (error) throw error;
      toast.success("Committee details saved successfully");
    } catch (error) {
      console.error("Error saving committee details:", error);
      toast.error("Failed to save committee details");
    } finally {
      setIsLoadingCommittee(false);
    }
  };

  const saveCampaignDetails = async () => {
    try {
      setIsLoadingCampaign(true);
      await form.trigger(["candidate_name", "office_sought"]);
      
      if (!form.formState.isValid) {
        toast.error("Please fill in all required campaign fields");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      const values = form.getValues();
      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          candidate_name: values.candidate_name,
          office_sought: values.office_sought,
          user_id: session.session.user.id,
        });

      if (error) throw error;
      toast.success("Campaign details saved successfully");
    } catch (error) {
      console.error("Error saving campaign details:", error);
      toast.error("Failed to save campaign details");
    } finally {
      setIsLoadingCampaign(false);
    }
  };

  const saveAddressDetails = async () => {
    try {
      setIsLoadingAddress(true);
      await form.trigger(["street_address", "city", "state", "zip_code"]);
      
      if (!form.formState.isValid) {
        toast.error("Please fill in all required address fields");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Please sign in to save settings");
        return;
      }

      const values = form.getValues();
      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          user_id: session.session.user.id,
        });

      if (error) throw error;
      toast.success("Address details saved successfully");
    } catch (error) {
      console.error("Error saving address details:", error);
      toast.error("Failed to save address details");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <GroupCard 
          title="Committee Details" 
          onSave={saveCommitteeDetails}
          isLoading={isLoadingCommittee}
        >
          <div className="space-y-4">
            <CommitteeTypeField form={form} />
            <CommitteeNameField form={form} />
          </div>
        </GroupCard>

        {committeeType === "candidate" && (
          <GroupCard 
            title="Campaign Details" 
            onSave={saveCampaignDetails}
            isLoading={isLoadingCampaign}
          >
            <CandidateFields />
          </GroupCard>
        )}

        <GroupCard 
          title="Verify Committee Address" 
          onSave={saveAddressDetails}
          isLoading={isLoadingAddress}
        >
          <AddressFields form={form} />
        </GroupCard>
      </form>
    </Form>
  );
}