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

  const handleAuthStateChange = async (session: Session | null) => {
    console.log("Handling auth state change:", session?.user?.email);
    
    if (session) {
      try {
        const result = await checkUserProfile(session);
        console.log("Profile check result:", result);
        
        switch (result.type) {
          case 'deleted':
            console.log("Profile deleted or not found");
            toast.error("Your profile appears to be missing. Please sign up again.");
            await supabase.auth.signOut();
            navigate("/signup", { replace: true });
            break;
          case 'incomplete':
            console.log("Profile incomplete, current path:", location.pathname);
            if (!noOnboardingRoutes.includes(location.pathname)) {
              navigate("/onboarding", { replace: true });
            }
            break;
          case 'complete':
            console.log("Profile complete, current path:", location.pathname);
            if (location.pathname === "/onboarding") {
              navigate("/dashboard", { replace: true });
            }
            break;
          case 'error':
            console.log("Error checking profile");
            // Error already handled in checkUserProfile
            break;
        }
      } catch (error) {
        console.error("Error in handleAuthStateChange:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } else if (!publicRoutes.includes(location.pathname)) {
      console.log("No session, redirecting to signin");
      navigate("/signin", { replace: true });
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email);
        if (session) {
          await handleAuthStateChange(session);
        }
        setSession(session);
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