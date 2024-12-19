import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// List of public routes that don't require authentication
const publicRoutes = ["/", "/pricing", "/signin", "/signup"];

// List of routes that don't require onboarding
const noOnboardingRoutes = [...publicRoutes, "/onboarding"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserProfile = async (session: Session) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', session.user.id)
      .single();

    if (error?.code === 'PGRST116' || !profile) {
      // Profile not found - user likely deleted
      await supabase.auth.signOut();
      setSession(null);
      toast.error("Your account appears to have been deleted. Please sign up again.");
      navigate("/signup", { replace: true });
      return null;
    }

    return profile;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await checkUserProfile(session);
        if (!profile) return; // User was logged out due to deleted account

        if (!noOnboardingRoutes.includes(location.pathname)) {
          if (!profile.first_name || !profile.last_name) {
            navigate("/onboarding", { replace: true });
          }
        }
      }
      
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await checkUserProfile(session);
      }
      
      setSession(session);
      if (!session && !publicRoutes.includes(location.pathname)) {
        navigate("/signin");
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