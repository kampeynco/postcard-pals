import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkOnboardingStatus } from "@/utils/profile";
import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleAuthChange = useCallback(async (
    event: string, 
    currentSession: Session | null,
    navigate: NavigateFunction
  ) => {
    console.log("Auth state changed:", event, currentSession?.user?.email);
    
    if (event === 'SIGNED_OUT') {
      setSession(null);
      setError(null);
      toast.info("You have been signed out");
      navigate(ROUTES.SIGNIN);
    } else if (event === 'SIGNED_IN' && currentSession) {
      setSession(currentSession);
      setError(null);
      toast.success("Successfully signed in");
      
      try {
        // Check if user has an ActBlue account
        const { data: actBlueAccount, error: actBlueError } = await supabase
          .from("actblue_accounts")
          .select("is_active")
          .eq("user_id", currentSession.user.id)
          .maybeSingle();

        if (actBlueError) {
          console.error("Error checking ActBlue account:", actBlueError);
          setError(new Error(actBlueError.message));
          toast.error("Error checking ActBlue account status");
          return;
        }

        // If no ActBlue account exists, route to dashboard empty state
        if (!actBlueAccount) {
          console.log("No ActBlue account found, routing to dashboard");
          navigate(ROUTES.DASHBOARD);
          return;
        }

        // Otherwise check onboarding status
        const onboardingStatus = await checkOnboardingStatus(currentSession);
        if (!onboardingStatus.completed) {
          navigate(ROUTES.ONBOARDING, { 
            state: { step: onboardingStatus.step }
          });
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setError(error instanceof Error ? error : new Error('Error checking profile status'));
        toast.error("Error checking profile status");
      }
    } else if (event === 'TOKEN_REFRESHED' && currentSession) {
      console.log("Token refreshed successfully");
      setSession(currentSession);
    }
  }, []);

  return {
    session,
    loading,
    error,
    setSession,
    setLoading,
    setError,
    handleAuthChange
  };
};
