import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { checkOnboardingStatus } from "@/utils/profile";

export const useAuthStateChange = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const onboardingStatus = await checkOnboardingStatus(session);
          
          if (!onboardingStatus.completed) {
            navigate(ROUTES.ONBOARDING, { 
              state: { step: onboardingStatus.step }
            });
            return;
          }

          const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
          navigate(from, { replace: true });
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          toast.error("Something went wrong. Please try again.");
        }
      }

      if (event === "SIGNED_OUT") {
        navigate(ROUTES.HOME);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
};