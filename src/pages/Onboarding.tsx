import { useNavigate } from "react-router-dom";
import { CommitteeForm } from "@/components/forms/CommitteeForm";
import { FormValues } from "@/components/forms/types";
import { supabase } from "@/integrations/supabase/client";
import { ROUTES } from "@/constants/routes";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("actblue_accounts")
      .insert({
        user_id: user.id,
        legal_committee_name: values.legal_committee_name,
        organization_name: values.organization_name,
        committee_type: values.committee_type,
        candidate_first_name: values.committee_type === "candidate" ? values.candidate_first_name : null,
        candidate_middle_name: values.committee_type === "candidate" ? values.candidate_middle_name : null,
        candidate_last_name: values.committee_type === "candidate" ? values.candidate_last_name : null,
        candidate_suffix: values.committee_type === "candidate" ? values.candidate_suffix : null,
        office_sought: values.committee_type === "candidate" ? values.office_sought : null,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        disclaimer_text: values.disclaimer_text,
        is_created: true,
      });

    if (error) throw error;
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Campaign Setup</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your committee setup to start sending thank you postcards.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <CommitteeForm onSubmit={handleSubmit} submitLabel="Complete Setup" />
      </div>
    </div>
  );
}