import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommitteeForm } from "@/components/forms/CommitteeForm";
import { FormValues } from "@/components/forms/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<FormValues>>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate(ROUTES.SIGNIN);
          return;
        }

        const { data, error } = await supabase
          .from('actblue_accounts')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        if (!data) {
          navigate(ROUTES.ONBOARDING);
          return;
        }

        setFormData({
          legal_committee_name: data.legal_committee_name,
          organization_name: data.organization_name || "",
          committee_type: data.committee_type,
          candidate_first_name: data.candidate_first_name || "",
          candidate_middle_name: data.candidate_middle_name || "",
          candidate_last_name: data.candidate_last_name || "",
          candidate_suffix: data.candidate_suffix,
          office_sought: data.office_sought,
          street_address: data.street_address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          disclaimer_text: data.disclaimer_text,
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [navigate]);

  const handleSubmit = async (values: FormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("actblue_accounts")
      .update({
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
      })
      .eq("user_id", user.id);

    if (error) throw error;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Committee Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <CommitteeForm 
            defaultValues={formData} 
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}