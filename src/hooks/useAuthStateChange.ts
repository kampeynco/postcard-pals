import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { checkOnboardingStatus } from '@/utils/onboarding';

const publicRoutes = [ROUTES.HOME, ROUTES.PRICING, ROUTES.SIGNIN, ROUTES.SIGNUP] as const;
const noOnboardingRoutes = [...publicRoutes, ROUTES.ONBOARDING] as const;

export const useAuthStateChange = () => {
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

  const handleAuthStateChange = async (newSession: Session | null) => {
    console.log("Auth state change handler called with session:", newSession?.user?.email);
    
    if (!newSession) {
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      const onboardingStatus = await checkOnboardingStatus(newSession);
      
      if (!onboardingStatus.completed && !noOnboardingRoutes.includes(location.pathname as typeof noOnboardingRoutes[number])) {
        navigate(ROUTES.ONBOARDING, { 
          replace: true,
          state: { step: onboardingStatus.step } 
        });
      }
      setSession(newSession);
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

  return { session, loading, initialized };
};