import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_UP' && session) {
        console.log("New signup detected, session:", session.user.email);
        setShowConfirmation(true);
        
        try {
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
            const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
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

            console.log("Email function response:", emailData);

            if (emailError) {
              console.error('Error sending confirmation email:', emailError);
              toast.error("There was an error sending your confirmation email. Please try signing in to resend it.");
            } else {
              toast.success("Please check your email to confirm your account.");
            }
          }

          // Wait for 5 seconds to show the confirmation message before redirecting
          setTimeout(async () => {
            await supabase.auth.signOut();
            navigate("/signin", { replace: true });
          }, 5000);

        } catch (error) {
          console.error("Error in signup process:", error);
          toast.error("An unexpected error occurred. Please try again.");
          await supabase.auth.signOut();
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
          {showConfirmation ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <p className="text-gray-600">
                We've sent you a confirmation email. Please check your inbox and follow the instructions to confirm your account.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to sign in page in a few seconds...
              </p>
            </div>
          ) : (
            <>
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
                    container: 'space-y-4',
                    message: 'text-sm text-red-600',
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
                      email_label: "Email address",
                      password_label: "Create a password",
                    },
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;