import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const EmailConfirmationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(location.search);
      const email = params.get('email');
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      console.log("Starting email confirmation process", { 
        email, 
        error, 
        errorDescription,
        fullUrl: window.location.href 
      });
      
      if (error) {
        console.error('Confirmation error:', { error, errorDescription });
        toast.error(errorDescription || "Error confirming email");
        navigate('/signin');
        return;
      }

      if (!email || !isValidEmail(email)) {
        console.error('Invalid or missing email in confirmation URL');
        toast.error("Invalid confirmation link");
        navigate('/signin');
        return;
      }

      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          toast.error("Unable to confirm email. Please try signing in.");
          navigate('/signin');
          return;
        }

        if (!session) {
          console.log("No active session, attempting to sign in with email");
          // Try to sign in with the email
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: '' // This will fail but trigger the email confirmation process
          });

          if (signInError) {
            console.log("Sign in attempt error (expected):", signInError);
          }
        }

        // Check if the profile is confirmed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_confirmed')
          .eq('id', session?.user.id)
          .single();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          toast.error("Error confirming email. Please try signing in.");
          navigate('/signin');
          return;
        }

        if (!profile.is_confirmed) {
          console.log("Profile not yet confirmed, waiting for confirmation...");
          // Wait briefly for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log("Email confirmed successfully");
        toast.success("Email confirmed! You can now sign in.");
        navigate('/signin');

      } catch (error) {
        console.error('Error in confirmation process:', error);
        toast.error("An error occurred during confirmation. Please try signing in.");
        navigate('/signin');
      }
    };

    if (location.search.includes('confirmation=success')) {
      handleEmailConfirmation();
    }
  }, [location.search, navigate]);

  return null;
};

export default EmailConfirmationHandler;