import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import AuthForm from "./signin/AuthForm";
import { AuthError } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, is_confirmed')
            .eq('id', session.user.id)
            .single();

          if (!profile?.is_confirmed) {
            console.log("Redirecting to onboarding");
            toast.success("Welcome! Let's set up your account.");
            navigate(ROUTES.ONBOARDING, { replace: true });
            return;
          }

          const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
          console.log("Redirecting to:", from);
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

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