import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailConfirmationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const params = new URLSearchParams(location.search);
      
      if (params.get('confirmation') === 'success') {
        const email = params.get('email');
        if (!email) {
          console.error('No email provided in confirmation URL');
          toast.error("Invalid confirmation link");
          return;
        }

        try {
          // Get current user before signing out
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast.error("Unable to confirm email. Please try signing in.");
            navigate('/signin');
            return;
          }

          // Update profile confirmation status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_confirmed: true })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            toast.error("There was an error confirming your email.");
            return;
          }

          // Sign out the user
          await supabase.auth.signOut();
          
          // Show success message and redirect to sign in
          toast.success("Email confirmed! Please sign in to continue.");
          navigate('/signin', { replace: true });
        } catch (error) {
          console.error('Error in confirmation process:', error);
          toast.error("An error occurred during confirmation. Please try signing in.");
          navigate('/signin');
        }
      }
    };

    handleEmailConfirmation();
  }, [location.search, navigate]);

  return null;
};

export default EmailConfirmationHandler;