import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "./context/AuthContext";
import { checkOnboardingStatus } from "@/utils/profile";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [onboardingRequired, setOnboardingRequired] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (session) {
        try {
          const status = await checkOnboardingStatus(session);
          setOnboardingRequired(!status.completed);
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setOnboardingRequired(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [session]);

  if (loading || checkingOnboarding) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  if (onboardingRequired && location.pathname !== ROUTES.ONBOARDING) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return <>{children}</>;
};