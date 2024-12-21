import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkUserProfile = async (session: Session) => {
  try {
    console.log("Checking user profile for:", session.user.email);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      if (error.code === 'PGRST116') {
        // Profile not found - user likely deleted
        await supabase.auth.signOut();
        toast.error("Your account appears to have been deleted. Please sign up again.");
        return { type: 'deleted' as const };
      }
      throw error;
    }

    console.log("Profile data:", profile);

    if (!profile.first_name || !profile.last_name) {
      console.log("Profile incomplete");
      return { type: 'incomplete' as const, profile };
    }

    return { type: 'complete' as const, profile };
  } catch (error) {
    console.error('Error checking user profile:', error);
    toast.error("An error occurred while checking your profile. Please try again.");
    return { type: 'error' as const };
  }
};