import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailConfirmationHandler = () => {
  const location = useLocation();

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
          // Update profile confirmation status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_confirmed: true })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            toast.error("There was an error confirming your email.");
            return;
          }

          // Make sure user is logged out after confirmation
          await supabase.auth.signOut();
          toast.success("Email confirmed! Please sign in to continue.");
        } catch (error) {
          console.error('Error in confirmation process:', error);
          toast.error("An error occurred during confirmation. Please try signing in.");
        }
      }
    };

    handleEmailConfirmation();
  }, [location.search]);

  return null;
};

export default EmailConfirmationHandler;