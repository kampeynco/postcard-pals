import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AuthContext } from "./context/AuthContext";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { checkOnboardingStatus } from "@/utils/profile";

export { useAuth } from "./context/AuthContext";
export { ProtectedRoute } from "./ProtectedRoute";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      console.log("Initial session check:", currentSession?.user?.email || "No session");
      if (error) {
        console.error("Error checking session:", error);
        toast.error("Authentication error: " + error.message);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setLoading(false);

      if (currentSession) {
        checkOnboardingStatus(currentSession).then((onboardingStatus) => {
          if (!onboardingStatus.completed) {
            navigate(ROUTES.ONBOARDING, { 
              state: { step: onboardingStatus.step }
            });
          }
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        toast.info("You have been signed out");
        navigate(ROUTES.SIGNIN);
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        const onboardingStatus = await checkOnboardingStatus(session);
        
        if (!onboardingStatus.completed) {
          toast.success("Welcome! Let's complete your account setup.");
          navigate(ROUTES.ONBOARDING, { 
            state: { step: onboardingStatus.step }
          });
        } else {
          toast.success("Successfully signed in");
          // Redirect to the originally requested page or dashboard
          const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
          navigate(from, { replace: true });
        }
      } else if (event === 'USER_UPDATED' && session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};