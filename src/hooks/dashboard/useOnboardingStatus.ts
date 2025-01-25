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

        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error checking profile:", profileError);
          setLoading(false);
          return;
        }

        // Check ActBlue account
        const { data: actBlueAccount, error: actBlueError } = await supabase
          .from("actblue_accounts")
          .select("is_active")
          .eq("user_id", session.session.user.id)
          .maybeSingle();

        if (actBlueError) {
          console.error("Error checking ActBlue account:", actBlueError);
          setLoading(false);
          return;
        }

        const hasProfile = !!(profile?.first_name || profile?.last_name);
        const isActBlueActive = !!actBlueAccount?.is_active;

        console.log("Onboarding status:", {
          hasProfile,
          isActBlueActive,
          profile,
          actBlueAccount
        });

        setIsOnboarded(hasProfile && isActBlueActive);
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