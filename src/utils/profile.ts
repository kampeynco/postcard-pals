import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface OnboardingStatus {
  completed: boolean;
  step: number;
}

// Profile utility functions
export const checkOnboardingStatus = async (session: Session): Promise<OnboardingStatus> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;

    if (!profile) {
      return { completed: false, step: 1 };
    }

    // Check if profile is complete
    const isProfileComplete = profile.first_name && 
                            profile.last_name && 
                            profile.phone_number &&
                            profile.is_confirmed;

    return { completed: isProfileComplete, step: isProfileComplete ? 4 : 1 };
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