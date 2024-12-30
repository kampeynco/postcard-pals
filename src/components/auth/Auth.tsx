import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { checkOnboardingStatus } from "@/utils/profile";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true 
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [onboardingRequired, setOnboardingRequired] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (session) {
        try {
          const status = await checkOnboardingStatus(session);
          setOnboardingRequired(!status.completed);
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setOnboardingRequired(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [session]);

  if (loading || checkingOnboarding) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  if (onboardingRequired && location.pathname !== ROUTES.ONBOARDING) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return <>{children}</>;
};