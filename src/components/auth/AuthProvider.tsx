import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { checkUserProfile } from "@/utils/profileUtils";
import { toast } from "sonner";

// List of public routes that don't require authentication
const publicRoutes = ["/", "/pricing", "/signin", "/signup"];

// List of routes that don't require onboarding
const noOnboardingRoutes = [...publicRoutes, "/onboarding"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
          
          if (result.type === 'incomplete' && !noOnboardingRoutes.includes(location.pathname)) {
            navigate("/onboarding", { replace: true });
          } else if (result.type === 'complete' && location.pathname === "/onboarding") {
            navigate("/dashboard", { replace: true });
          }
        } else if (!publicRoutes.includes(location.pathname)) {
          navigate("/signin", { replace: true });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        setLoading(false);
        toast.error("Error initializing authentication");
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      
      if (session) {
        const result = await checkUserProfile(session);
        console.log("Profile check on auth change:", result);
        
        if (result.type === 'incomplete' && !noOnboardingRoutes.includes(location.pathname)) {
          navigate("/onboarding", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from "@/contexts/AuthContext";