import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "./context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};