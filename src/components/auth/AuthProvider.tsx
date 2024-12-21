import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { checkUserProfile } from "@/utils/profileUtils";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProfileCheckResult } from "@/types/auth";

const publicRoutes = [ROUTES.HOME, ROUTES.PRICING, ROUTES.SIGNIN, ROUTES.SIGNUP] as const;
const noOnboardingRoutes = [...publicRoutes, ROUTES.ONBOARDING] as const;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error: Error) => {
    console.error("Auth error:", error);
    toast.error(error.message || "Authentication error occurred");
    setLoading(false);
  };

  const handleAuthStateChange = async (session: Session | null) => {
    if (!session) return;
    
    try {
      const result = await checkUserProfile(session);
      if (result.type === 'incomplete' && !noOnboardingRoutes.includes(location.pathname as typeof noOnboardingRoutes[number])) {
        navigate(ROUTES.ONBOARDING, { replace: true });
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleInitialNavigation = async (session: Session | null, result: ProfileCheckResult) => {
    try {
      if (result.type === 'incomplete' && !noOnboardingRoutes.includes(location.pathname as typeof noOnboardingRoutes[number])) {
        navigate(ROUTES.ONBOARDING, { replace: true });
      } else if (result.type === 'complete' && location.pathname === ROUTES.ONBOARDING) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error) {
      handleError(error as Error);
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email);
        setSession(session);
        
        if (session) {
          const result = await checkUserProfile(session);
          console.log("Profile check result:", result);
          await handleInitialNavigation(session, result);
        } else if (!publicRoutes.includes(location.pathname as typeof publicRoutes[number])) {
          navigate(ROUTES.SIGNIN, { replace: true });
        }
        
        setLoading(false);
      } catch (error) {
        handleError(error as Error);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      await handleAuthStateChange(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from "@/contexts/AuthContext";