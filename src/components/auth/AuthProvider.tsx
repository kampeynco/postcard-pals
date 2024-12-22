import { AuthContext } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, initialized } = useAuthStateChange();

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from "@/contexts/AuthContext";