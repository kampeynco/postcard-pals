import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for confirmation success message in URL
    const params = new URLSearchParams(location.search);
    if (params.get('confirmation') === 'success') {
      // Update the profile to mark as confirmed
      const updateProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ is_confirmed: true })
            .eq('id', user.id);
          
          if (error) {
            console.error('Error updating profile:', error);
            toast.error("There was an error confirming your email.");
          } else {
            toast.success("Email confirmed! Please sign in to continue.");
          }
        }
      };
      updateProfile();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Check if user's profile is confirmed
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, is_confirmed')
          .eq('id', session.user.id)
          .single();

        if (!profile?.is_confirmed) {
          toast.error("Please confirm your email before signing in.");
          await supabase.auth.signOut();
          return;
        }

        // If profile is incomplete, redirect to onboarding
        if (!profile?.first_name || !profile?.last_name) {
          toast.success("Welcome! Let's set up your account.");
          navigate("/onboarding", { replace: true });
          return;
        }

        // Otherwise, redirect to requested page or dashboard
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
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
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
            view="sign_in"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;