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
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error: Error) => {
    console.error("Auth error:", error);
    toast.error(error.message || "Authentication error occurred");
    setLoading(false);
  };

  const checkOnboardingStatus = async (session: Session) => {
    try {
      // Check profile status
      const profileResult = await checkUserProfile(session);
      if (profileResult.type === 'incomplete') {
        return { step: 1 };
      }

      // Check campaign creation status
      const { data: actblueAccount } = await supabase
        .from('actblue_accounts')
        .select('is_created, is_onboarded')
        .eq('user_id', session.user.id)
        .single();

      if (!actblueAccount?.is_created) {
        return { step: 2 };
      }

      if (!actblueAccount?.is_onboarded) {
        return { step: 3 };
      }

      return { completed: true };
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return { step: 1 };
    }
  };

  const handleAuthStateChange = async (session: Session | null) => {
    console.log("Auth state change handler called with session:", session?.user?.email);
    
    if (!session) {
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      const onboardingStatus = await checkOnboardingStatus(session);
      
      if (!onboardingStatus.completed && !noOnboardingRoutes.includes(location.pathname as typeof noOnboardingRoutes[number])) {
        navigate(ROUTES.ONBOARDING, { 
          replace: true,
          state: { step: onboardingStatus.step } 
        });
      }
      setSession(session);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    let isSubscribed = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email);
        
        if (error) throw error;

        if (isSubscribed) {
          if (session) {
            const onboardingStatus = await checkOnboardingStatus(session);
            setSession(session);
            
            if (!onboardingStatus.completed && !noOnboardingRoutes.includes(location.pathname as typeof noOnboardingRoutes[number])) {
              navigate(ROUTES.ONBOARDING, { 
                replace: true,
                state: { step: onboardingStatus.step } 
              });
            }
          } else if (!publicRoutes.includes(location.pathname as typeof publicRoutes[number])) {
            navigate(ROUTES.SIGNIN, { replace: true });
          }
        }
      } catch (error) {
        handleError(error as Error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      if (isSubscribed) {
        await handleAuthStateChange(session);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from "@/contexts/AuthContext";