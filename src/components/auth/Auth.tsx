import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AuthContext } from "./context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export { useAuth } from "./context/AuthContext";
export { ProtectedRoute } from "./ProtectedRoute";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
          toast.error("Authentication error: " + error.message);
          return;
        }
        
        if (currentSession) {
          console.log("Session found for user:", currentSession.user.email);
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Error in session check:", error);
        toast.error("Failed to check authentication status");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        toast.info("You have been signed out");
        navigate(ROUTES.SIGNIN);
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        toast.success("Successfully signed in");
        navigate(ROUTES.DASHBOARD);
      } else if (event === 'USER_UPDATED' && session) {
        setSession(session);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};