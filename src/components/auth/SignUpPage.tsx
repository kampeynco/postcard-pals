import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import SignUpForm from "./signup/SignUpForm";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "./Auth";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (session) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && event === 'SIGNED_IN') {
        console.log("New signup detected, session:", session.user.email);
        // AuthProvider will handle the redirection based on onboarding status
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, session]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />
      <div className="flex-grow flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <SignUpForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;