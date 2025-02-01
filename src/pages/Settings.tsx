import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActBlueSettingsForm } from "@/components/settings/ActBlueSettingsForm";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { TemplateSettings } from "@/components/settings/TemplateSettings";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [hasActBlueAccount, setHasActBlueAccount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActBlueAccount = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate(ROUTES.SIGNIN);
          return;
        }

        const { data: account } = await supabase
          .from('actblue_accounts')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!account) {
          navigate(ROUTES.ONBOARDING);
          return;
        }

        setHasActBlueAccount(true);
      } catch (error) {
        console.error('Error checking ActBlue account:', error);
      } finally {
        setLoading(false);
      }
    };

    checkActBlueAccount();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!hasActBlueAccount) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>ActBlue Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ActBlueSettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <BillingSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}