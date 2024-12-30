import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { checkOnboardingStatus } from "@/utils/profile";

export const useAuthStateChange = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        await handleSignedInUser(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignedInUser = async (session: any) => {
    try {
      const onboardingStatus = await checkOnboardingStatus(session);
      
      if (!onboardingStatus.completed) {
        console.log("Redirecting to onboarding step:", onboardingStatus.step);
        toast.success("Welcome! Let's complete your account setup.");
        navigate(ROUTES.ONBOARDING, { 
          replace: true,
          state: { step: onboardingStatus.step }
        });
        return;
      }

      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      console.log("Onboarding complete. Redirecting to:", from);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error in sign in process:', error);
      toast.error("An unexpected error occurred. Please try again.");
      await supabase.auth.signOut();
    }
  };
};
