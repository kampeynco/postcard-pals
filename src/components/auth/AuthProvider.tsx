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
    try {
      console.log("Checking user profile for:", session.user.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          // Profile not found - user likely deleted
          await supabase.auth.signOut();
          setSession(null);
          toast.error("Your account appears to have been deleted. Please sign up again.");
          navigate("/signup", { replace: true });
          return null;
        }
        throw error;
      }

      console.log("Profile data:", profile);

      // If profile is incomplete, redirect to onboarding
      if (!profile.first_name || !profile.last_name) {
        if (!noOnboardingRoutes.includes(location.pathname)) {
          console.log("Profile incomplete, redirecting to onboarding");
          navigate("/onboarding", { replace: true });
        }
        return profile;
      }

      // If profile is complete and user is on onboarding, redirect to dashboard
      if (location.pathname === "/onboarding") {
        navigate("/dashboard", { replace: true });
      }

      return profile;
    } catch (error) {
      console.error('Error checking user profile:', error);
      toast.error("An error occurred while checking your profile. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      
      if (session) {
        await checkUserProfile(session);
      }
      
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      
      if (session) {
        await checkUserProfile(session);
      }
      
      setSession(session);
      if (!session && !publicRoutes.includes(location.pathname)) {
        navigate("/signin", { replace: true });
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