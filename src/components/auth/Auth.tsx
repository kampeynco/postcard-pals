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
    let subscription: { unsubscribe: () => void } | null = null;

    const setupAuth = async () => {
      try {
        await initializeAuth({ setSession, setError, setLoading, navigate });
        
        const { data: authData } = supabase.auth.onAuthStateChange(
          (event, currentSession) => handleAuthChange(event, currentSession, navigate)
        );
        
        subscription = authData.subscription;
      } catch (err) {
        console.error('Error setting up auth:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      }
    };

    setupAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, handleAuthChange, setSession, setError, setLoading]);

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