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
      
      // Step 1: Validate email parameter
      if (!email || !isValidEmail(email)) {
        console.error('Invalid or missing email in confirmation URL');
        toast.error("Invalid confirmation link");
        navigate('/signin');
        return;
      }

      try {
        // Step 2: Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error getting user:', userError);
          toast.error("Unable to confirm email. Please try signing in.");
          navigate('/signin');
          return;
        }

        // Step 3: Sign out user FIRST
        await supabase.auth.signOut();
        console.log("User signed out successfully");

        // Step 4: Update profile confirmation status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_confirmed: true })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          toast.error("There was an error confirming your email.");
          navigate('/signin');
          return;
        }

        // Step 5: Show success message and redirect with delay
        toast.success("Email confirmed successfully! Please sign in to continue.");
        
        // Step 6: Redirect to sign in page after a short delay
        setTimeout(() => {
          navigate('/signin', { replace: true });
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