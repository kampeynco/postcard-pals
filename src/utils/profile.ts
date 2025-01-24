import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface OnboardingStatus {
  completed: boolean;
  step: number;
}

export const checkOnboardingStatus = async (session: Session): Promise<OnboardingStatus> => {
  try {
    // Check profile completion
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    const isProfileComplete = profile?.first_name && 
                            profile?.last_name && 
                            profile?.phone_number;

    if (!isProfileComplete) {
      return { completed: false, step: 1 };
    }

    // Check ActBlue account
    const { data: actblueAccount, error: actblueError } = await supabase
      .from('actblue_accounts')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (actblueError && actblueError.code !== 'PGRST116') { // Not found error
      throw actblueError;
    }

    const isActBlueComplete = actblueAccount?.is_onboarded;

    if (!actblueAccount || !isActBlueComplete) {
      return { completed: false, step: 2 };
    }

    return { completed: true, step: 4 };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    throw error;
  }
};

export const getProfileData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};