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
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error("An error occurred while checking your profile. Please try again.");
      return { type: 'error' as const };
    }

    // If no profile found
    if (!profile) {
      console.log("No profile found");
      return { type: 'deleted' as const };
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