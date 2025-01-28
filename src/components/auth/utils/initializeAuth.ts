import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkOnboardingStatus } from "@/utils/profile";
import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface InitializeAuthParams {
  setSession: (session: Session | null) => void;
  setError: (error: Error | null) => void;
  setLoading: (loading: boolean) => void;
  navigate: NavigateFunction;
}

export const initializeAuth = async ({
  setSession,
  setError,
  setLoading,
  navigate
}: InitializeAuthParams) => {
  try {
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    
    console.log("Initial session check:", currentSession?.user?.email || "No session");
    
    if (sessionError) {
      console.error("Error checking session:", sessionError);
      setError(new Error(sessionError.message));
      toast.error("Authentication error: " + sessionError.message);
      setLoading(false);
      return;
    }

    setSession(currentSession);

    if (currentSession) {
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

        // If no ActBlue account exists, route to onboarding
        if (!actBlueAccount) {
          console.log("No ActBlue account found, routing to onboarding");
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
        console.error("Error checking profile status:", error);
        setError(error instanceof Error ? error : new Error('Error checking profile status'));
        toast.error("Error checking profile status");
      }
    }
  } catch (error) {
    console.error("Unexpected error during auth initialization:", error);
    setError(error instanceof Error ? error : new Error('An unexpected error occurred'));
    toast.error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};
