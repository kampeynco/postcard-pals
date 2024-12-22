import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import AuthForm from "./signin/AuthForm";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === 'SIGNED_IN' && session) {
        try {
          // Check if user's profile is complete
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, is_confirmed')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            toast.error("There was an error signing in. Please try again.");
            await supabase.auth.signOut();
            return;
          }

          // If profile is incomplete, redirect to onboarding
          if (!profile?.is_confirmed) {
            console.log("Redirecting to onboarding");
            toast.success("Welcome! Let's set up your account.");
            navigate("/onboarding", { replace: true });
            return;
          }

          // Otherwise, redirect to requested page or dashboard
          const from = (location.state as any)?.from?.pathname || "/dashboard";
          console.log("Redirecting to:", from);
          toast.success("Welcome back!");
          navigate(from, { replace: true });
        } catch (error) {
          console.error('Error in sign in process:', error);
          toast.error("An unexpected error occurred. Please try again.");
          await supabase.auth.signOut();
        }
      } else if (event === 'SIGNED_OUT') {
        toast.info("You have been signed out.");
      } else if (event === 'USER_UPDATED') {
        toast.info("Your account has been updated.");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info("Check your email for password reset instructions.");
      } else if (event === 'INITIAL_SESSION') {
        // Handle initial session load silently
        console.log("Initial session loaded");
      }
    });

    return () => subscription.unsubscribe();
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