import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("New user signed in, checking if confirmation email needed");
        
        // Check if this is a new signup by checking if profile exists and is not confirmed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_confirmed')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          toast.error("There was an error during signup. Please try again.");
          await supabase.auth.signOut();
          return;
        }

        if (!profile?.is_confirmed) {
          console.log("Sending confirmation email to new user");
          
          // Send confirmation email using our Resend function
          const { error: emailError } = await supabase.functions.invoke('send-email', {
            body: {
              to: [session.user.email],
              subject: "Welcome to Thanks From Us - Please Confirm Your Email",
              html: `
                <h1>Welcome to Thanks From Us!</h1>
                <p>Thank you for signing up. Please confirm your email by clicking the link below:</p>
                <p><a href="${window.location.origin}/signin?confirmation=success">Confirm Email</a></p>
                <p>If you did not create this account, please ignore this email.</p>
                <p>Best regards,<br>Thanks From Us Team</p>
              `,
            }
          });

          if (emailError) {
            console.error('Error sending confirmation email:', emailError);
            toast.error("There was an error sending your confirmation email. Please try signing in to resend it.");
          } else {
            toast.success("Please check your email to confirm your account.");
          }

          // Sign out the user after sending confirmation email
          await supabase.auth.signOut();
          navigate("/signin", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />
      <div className="flex-grow flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">Get started with Thanks From Us</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              className: {
                button: 'disabled:opacity-50 disabled:cursor-not-allowed',
              },
            }}
            theme="light"
            providers={[]}
            view="sign_up"
            localization={{
              variables: {
                sign_up: {
                  button_label: "Sign up",
                  loading_button_label: "Signing up...",
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

export default SignUpPage;