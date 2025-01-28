import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/components/auth/Auth";
import LandingPage from "./LandingPage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const Index = () => {
  const navigate = useNavigate();
  const { session, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
  }

  // If not loading and no session, show the landing page
  return <LandingPage />;
};

export default Index;