import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthError } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import SignUpForm from "./signup/SignUpForm";
import ConfirmationMessage from "./signup/ConfirmationMessage";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && event === 'SIGNED_IN') {
        console.log("New signup detected, session:", session.user.email);
        
        try {
          // Send confirmation email using our Resend function
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
            body: {
              to: [session.user.email],
              from: "Thanks From Us <noreply@thanksfromus.com>",
              subject: "Welcome to Thanks From Us - Please Confirm Your Email",
              html: `
                <h1>Welcome to Thanks From Us!</h1>
                <p>Thank you for signing up. Please confirm your email by clicking the link below:</p>
                <p><a href="${window.location.origin}/signin?confirmation=success&email=${encodeURIComponent(session.user.email || '')}">Confirm Email</a></p>
                <p>If you did not create this account, please ignore this email.</p>
                <p>Best regards,<br>Thanks From Us Team</p>
              `,
            }
          });

          if (emailError) {
            console.error('Error sending confirmation email:', emailError);
            toast.error("There was an error sending your confirmation email. Please try signing in to resend it.");
          } else {
            console.log("Confirmation email response:", emailData);
            setShowConfirmation(true);
            toast.success("Please check your email to confirm your account.");
            
            // Sign out the user immediately
            await supabase.auth.signOut();
            
            // Wait for 5 seconds to show the confirmation message before redirecting
            setTimeout(() => {
              navigate("/signin", { replace: true });
            }, 5000);
          }
        } catch (error) {
          const authError = error as AuthError;
          console.error("Error in signup process:", authError);
          toast.error(authError.message || "An unexpected error occurred. Please try again.");
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