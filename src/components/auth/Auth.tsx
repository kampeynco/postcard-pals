import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AuthContext } from "./context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";
import { initializeAuth } from "./utils/initializeAuth";

export { useAuth } from "./context/AuthContext";
export { ProtectedRoute } from "./ProtectedRoute";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    session,
    loading,
    error,
    setSession,
    setLoading,
    setError,
    handleAuthChange
  } = useAuthState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await initializeAuth({ setSession, setError, setLoading, navigate });
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => handleAuthChange(event, currentSession, navigate)
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate, handleAuthChange, setSession, setError, setLoading]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading, 
      error,
      isAuthenticated: !!session 
    }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};