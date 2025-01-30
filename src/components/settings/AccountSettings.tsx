import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommitteeTypeField } from "@/components/actblue/CommitteeTypeField";
import { CommitteeNameField } from "@/components/actblue/CommitteeNameField";
import { CandidateFields } from "@/components/actblue/CandidateFields";
import { AddressFields } from "@/components/actblue/AddressFields";
import { DisclaimerField } from "@/components/actblue/DisclaimerField";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema, OfficeType } from "@/components/actblue/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/Auth";
import { toast } from "sonner";
import { FormProvider } from "react-hook-form";

export const AccountSettings = () => {
  const { session } = useAuth();
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

  // Load existing data
  useEffect(() => {
    const loadAccountData = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from("actblue_accounts")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;
        if (data) {
          form.reset({
            committee_name: data.committee_name,
            committee_type: data.committee_type,
            candidate_name: data.candidate_name || "",
            office_sought: data.office_sought as OfficeType || undefined,
            disclaimer_text: data.disclaimer_text,
            street_address: data.street_address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
          });
        }
      } catch (error) {
        console.error("Error loading account data:", error);
        toast.error("Failed to load account data");
      }
    };

    loadAccountData();
  }, [session?.user?.id]);

  const onSubmitCommittee = async (data: FormValues) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("actblue_accounts")
        .upsert({
          committee_name: data.committee_name,
          committee_type: data.committee_type,
          candidate_name: data.candidate_name,
          office_sought: data.office_sought,
          disclaimer_text: data.disclaimer_text,
          street_address: data.street_address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          user_id: session.user.id,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success("Committee details saved successfully");
    } catch (error) {
      console.error("Error saving committee details:", error);
      toast.error("Failed to save committee details");
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCommittee)}>
          <Card>
            <CardHeader>
              <CardTitle>Committee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CommitteeNameField form={form} />
              <CommitteeTypeField form={form} />
              <CandidateFields />
              <DisclaimerField form={form} />
              <Button type="submit">Save Committee Details</Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressFields form={form} />
              <Button 
                onClick={form.handleSubmit(onSubmitCommittee)} 
                className="mt-4"
              >
                Save Address
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
};