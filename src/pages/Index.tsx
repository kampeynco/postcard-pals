import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/components/auth/Auth";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Thanks From Us</h1>
      <p className="mt-4 text-lg text-gray-600">Your one-stop solution for donor appreciation.</p>
      <div className="mt-6">
        <button
          onClick={() => navigate(ROUTES.SIGNIN)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Index;
