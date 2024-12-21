import { createContext, useContext } from "react";
import type { AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true 
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};