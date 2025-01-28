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
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
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
          // Check onboarding status and redirect accordingly
          try {
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
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
        setError(error instanceof Error ? error : new Error('An unexpected error occurred'));
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setError(null);
        toast.info("You have been signed out");
        navigate(ROUTES.SIGNIN);
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setError(null);
        toast.success("Successfully signed in");
        
        try {
          const onboardingStatus = await checkOnboardingStatus(session);
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
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log("Token refreshed successfully");
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading, 
      error,
      isAuthenticated: !!session 
    }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};