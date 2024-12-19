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
      
      console.log("Starting email confirmation process for:", email);
      
      if (!email || !isValidEmail(email)) {
        console.error('Invalid or missing email in confirmation URL');
        toast.error("Invalid confirmation link");
        navigate('/signin');
        return;
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error getting user:', userError);
          toast.error("Unable to confirm email. Please try signing in.");
          navigate('/signin');
          return;
        }

        console.log("Found user for confirmation:", user.email);

        // Call edge function to update profile
        const { data: confirmationData, error: confirmError } = await supabase.functions.invoke('confirm-email', {
          body: { 
            userId: user.id,
            email: email 
          }
        });

        if (confirmError) {
          console.error('Error confirming email:', confirmError);
          toast.error("There was an error confirming your email. Please try again.");
          navigate('/signin');
          return;
        }

        console.log("Edge function response:", confirmationData);

        if (!confirmationData?.success || !confirmationData?.profile?.is_confirmed) {
          console.error('Profile update failed:', confirmationData);
          toast.error("Failed to confirm email. Please try again.");
          navigate('/signin');
          return;
        }

        console.log("Email confirmed successfully. Profile:", confirmationData.profile);
        toast.success("Email confirmed! Redirecting to dashboard...");
        
        // Redirect to dashboard after successful confirmation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);

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