import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import AuthForm from "./signin/AuthForm";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "./Auth";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard or requested page
    if (session) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  if (loading) {
    return null; // AuthProvider will show the loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />
      <div className="flex-grow flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>
          <AuthForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;