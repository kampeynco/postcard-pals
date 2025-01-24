import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

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
        navigate('/signin', { replace: true });
        return;
      }

      if (!email || !isValidEmail(email)) {
        console.error('Invalid or missing email in confirmation URL');
        toast.error("Invalid confirmation link");
        navigate('/signin', { replace: true });
        return;
      }

      try {
        // Sign out the user first
        await supabase.auth.signOut();
        console.log("User signed out");

        // Check profile confirmation status
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_confirmed')
          .eq('email', email)
          .single();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          toast.error("Error confirming email. Please try signing in.");
          navigate('/signin', { replace: true });
          return;
        }

        const profile = data as Profile | null;

        if (!profile?.is_confirmed) {
          console.log("Profile not yet confirmed, waiting for confirmation...");
          // Brief delay for trigger completion
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log("Email confirmed successfully");
        toast.success("Email confirmed! Please sign in to continue.");
        navigate('/signin', { replace: true });

      } catch (error) {
        console.error('Error in confirmation process:', error);
        toast.error("An error occurred during confirmation. Please try signing in.");
        navigate('/signin', { replace: true });
      }
    };

    if (location.search.includes('confirmation=success')) {
      handleEmailConfirmation();
    }
  }, [location.search, navigate]);

  return null;
};

export default EmailConfirmationHandler;