import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import AuthForm from "./signin/AuthForm";
import { AuthError } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { checkOnboardingStatus } from "@/utils/onboarding";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only check for existing session on mount
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        handleSignedInUser(session);
      }
    };
    
    checkExistingSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        await handleSignedInUser(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const handleSignedInUser = async (session: any) => {
    try {
      // First check onboarding status
      const onboardingStatus = await checkOnboardingStatus(session);
      
      if (!onboardingStatus.completed) {
        console.log("Redirecting to onboarding step:", onboardingStatus.step);
        toast.success("Welcome! Let's complete your account setup.");
        navigate(ROUTES.ONBOARDING, { 
          replace: true,
          state: { step: onboardingStatus.step }
        });
        return;
      }

      // If onboarding is complete, proceed with normal sign in
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      console.log("Onboarding complete. Redirecting to:", from);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error in sign in process:', error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      await supabase.auth.signOut();
    }
  };

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