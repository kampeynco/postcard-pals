import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/components/auth/Auth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [session, navigate]);

  const handleGetStarted = () => {
    navigate(ROUTES.SIGNUP);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Thanks From Us</h1>
      <p className="mt-4 text-lg text-gray-600">Your one-stop solution for donor appreciation.</p>
      <div className="mt-6 space-x-4">
        <Button
          onClick={() => navigate(ROUTES.SIGNIN)}
          variant="outline"
          className="px-6"
        >
          Sign In
        </Button>
        <Button
          onClick={handleGetStarted}
          className="px-6 bg-[#4B5EE4] hover:bg-[#4B5EE4]/90"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;