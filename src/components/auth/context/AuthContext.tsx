import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  error: null,
  isAuthenticated: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};