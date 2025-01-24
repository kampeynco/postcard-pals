import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Please sign in to access this page");
    }
  }, [loading, session]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};