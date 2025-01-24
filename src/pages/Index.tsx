import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/components/auth/Auth";
import LandingPage from "./LandingPage";

const Index = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [session, loading, navigate]);

  // If loading, let the AuthProvider handle the loading spinner
  if (loading) return null;

  // If not loading and no session, show the landing page
  return <LandingPage />;
};

export default Index;