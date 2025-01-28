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
    initializeAuth(setSession, setError, setLoading, navigate);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [location]);

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