import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { checkUserProfile } from "@/utils/profileUtils";

// List of public routes that don't require authentication
const publicRoutes = ["/", "/pricing", "/signin", "/signup"];

// List of routes that don't require onboarding
const noOnboardingRoutes = [...publicRoutes, "/onboarding"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthStateChange = async (session: Session | null) => {
    if (session) {
      const result = await checkUserProfile(session);
      
      switch (result.type) {
        case 'deleted':
          navigate("/signup", { replace: true });
          break;
        case 'incomplete':
          if (!noOnboardingRoutes.includes(location.pathname)) {
            navigate("/onboarding", { replace: true });
          }
          break;
        case 'complete':
          if (location.pathname === "/onboarding") {
            navigate("/dashboard", { replace: true });
          }
          break;
        case 'error':
          // Error already handled in checkUserProfile
          break;
      }
    } else if (!publicRoutes.includes(location.pathname)) {
      navigate("/signin", { replace: true });
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      if (session) {
        handleAuthStateChange(session);
      }
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      await handleAuthStateChange(session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export useAuth from the context
export { useAuth } from "@/contexts/AuthContext";