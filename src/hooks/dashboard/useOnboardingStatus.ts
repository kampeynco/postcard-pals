import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useOnboardingStatus = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          setLoading(false);
          return;
        }

        const { data: actBlueAccount, error } = await supabase
          .from("actblue_accounts")
          .select("is_onboarded")
          .eq("user_id", session.session.user.id)
          .maybeSingle();

        if (!error && actBlueAccount?.is_onboarded) {
          setIsOnboarded(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  return { isOnboarded, loading };
};