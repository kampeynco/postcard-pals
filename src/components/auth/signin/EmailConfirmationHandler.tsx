import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

const EmailConfirmationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(location.search);
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      console.log("Starting email confirmation process", { 
        error, 
        errorDescription,
        fullUrl: window.location.href 
      });
      
      if (error) {
        console.error('Confirmation error:', { error, errorDescription });
        toast.error(errorDescription || "Error confirming email");
        navigate(ROUTES.SIGNIN, { replace: true });
        return;
      }

      try {
        // Sign out any existing session
        await supabase.auth.signOut();
        console.log("User signed out");

        console.log("Email confirmed successfully");
        toast.success("Successfully confirmed! Please sign in to continue.");
        navigate(ROUTES.SIGNIN, { replace: true });

      } catch (error) {
        console.error('Error in confirmation process:', error);
        toast.error("An error occurred during confirmation. Please try signing in.");
        navigate(ROUTES.SIGNIN, { replace: true });
      }
    };

    if (location.search.includes('confirmation=success')) {
      handleEmailConfirmation();
    }
  }, [location.search, navigate]);

  return null;
};

export default EmailConfirmationHandler;