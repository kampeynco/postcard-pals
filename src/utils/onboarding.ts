import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCheckResult } from "@/types/auth";

export const checkOnboardingStatus = async (session: Session) => {
  try {
    // Check profile status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_confirmed')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_confirmed) {
      return { step: 1 };
    }

    // Check campaign creation status
    const { data: actblueAccount } = await supabase
      .from('actblue_accounts')
      .select('is_created, is_onboarded')
      .eq('user_id', session.user.id)
      .single();

    if (!actblueAccount?.is_created) {
      return { step: 2 };
    }

    if (!actblueAccount?.is_onboarded) {
      return { step: 3 };
    }

    return { completed: true };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { step: 1 };
  }
};

export const checkUserProfile = async (session: Session): Promise<ProfileCheckResult> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    if (!profile) return { type: 'deleted' };

    return profile.is_confirmed
      ? { type: 'complete', profile }
      : { type: 'incomplete', profile };
  } catch (error) {
    console.error('Error checking user profile:', error);
    return { type: 'error' };
  }
};