import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
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

        // Get user profile by email
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
        
        if (getUserError) {
          console.error('Error finding user:', getUserError);
          toast.error("Could not verify your account. Please try signing in.");
          return;
        }

        const user = users.find((u: User) => u.email === email);
        if (!user) {
          console.error('User not found with email:', email);
          toast.error("Could not verify your account. Please try signing in.");
          return;
        }

        const userId = user.id;
        console.log("Updating confirmation status for user:", userId);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_confirmed: true })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          toast.error("There was an error confirming your email.");
          return;
        }
        
        // Make sure user is logged out after confirmation
        await supabase.auth.signOut();
        toast.success("Email confirmed! Please sign in to continue.");
      }
    };

    handleEmailConfirmation();
  }, [location.search]);

  return null;
};

export default EmailConfirmationHandler;