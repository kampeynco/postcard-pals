import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { retry } from "./retry";
import { ProfileCheckResult } from "@/types/auth";

export const checkUserProfile = async (session: Session): Promise<ProfileCheckResult> => {
  return retry(
    async () => {
      console.log("Checking user profile for:", session.user.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error("An error occurred while checking your profile");
        return { type: 'error' as const };
      }

      if (!profile) {
        console.log("No profile found");
        return { type: 'deleted' as const };
      }

      console.log("Profile data:", profile);

      const isComplete = Boolean(
        profile.first_name &&
        profile.last_name &&
        profile.phone_number
      );

      return {
        type: isComplete ? 'complete' as const : 'incomplete' as const,
        profile
      };
    },
    {
      retries: 3,
      delay: 1000,
      onError: (error) => {
        console.error('Profile check error:', error);
        toast.error("Error checking profile. Retrying...");
      }
    }
  );
};