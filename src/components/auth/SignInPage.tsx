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
      toast.success("Email confirmed! Please sign in to continue.");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session); // Debug log

      if (session) {
        try {
          // Check if user's profile exists and is confirmed
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

          // Update profile confirmation status if coming from confirmation link
          if (params.get('confirmation') === 'success' && !profile?.is_confirmed) {
            console.log("Updating profile confirmation status"); // Debug log
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ is_confirmed: true })
              .eq('id', session.user.id);
            
            if (updateError) {
              console.error('Error updating profile:', updateError);
              toast.error("There was an error confirming your email.");
              await supabase.auth.signOut();
              return;
            }
          } else if (!profile?.is_confirmed) {
            console.log("Profile not confirmed"); // Debug log
            toast.error("Please confirm your email before signing in.");
            await supabase.auth.signOut();
            return;
          }

          // If profile is incomplete, redirect to onboarding
          if (!profile?.first_name || !profile?.last_name) {
            console.log("Redirecting to onboarding"); // Debug log
            toast.success("Welcome! Let's set up your account.");
            navigate("/onboarding", { replace: true });
            return;
          }

          // Otherwise, redirect to requested page or dashboard
          const from = (location.state as any)?.from?.pathname || "/dashboard";
          console.log("Redirecting to:", from); // Debug log
          navigate(from, { replace: true });
        } catch (error) {
          console.error('Error in sign in process:', error);
          toast.error("An unexpected error occurred. Please try again.");
          await supabase.auth.signOut();
        }
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
            appearance={{ 
              theme: ThemeSupa,
              className: {
                button: 'w-full disabled:opacity-50 disabled:cursor-not-allowed',
                container: 'space-y-4',
                message: 'text-sm text-red-600',
                input: 'w-full',
                label: 'block text-sm font-medium text-gray-700',
              },
            }}
            theme="light"
            providers={[]}
            view="sign_in"
            localization={{
              variables: {
                sign_in: {
                  button_label: "Sign in",
                  loading_button_label: "Signing in...",
                  email_label: "Email address",
                  password_label: "Password",
                },
              },
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;