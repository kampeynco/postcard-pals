import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import SignUpForm from "./signup/SignUpForm";
import ConfirmationMessage from "./signup/ConfirmationMessage";

type AuthEvent = 'SIGNED_IN' | 'SIGNED_UP' | 'SIGNED_OUT' | 'USER_UPDATED' | 'USER_DELETED';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthEvent, session) => {
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
            <ConfirmationMessage />
          ) : (
            <SignUpForm />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;