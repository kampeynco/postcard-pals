import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export const useAuthStateChange = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkActBlueAccount = async (userId: string) => {
      const { data: actBlueAccount, error } = await supabase
        .from('actblue_accounts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking ActBlue account:', error);
        return false;
      }

      return !!actBlueAccount;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session?.user) {
            const hasActBlueAccount = await checkActBlueAccount(session.user.id);
            if (!hasActBlueAccount) {
              console.log('No ActBlue account found, routing to onboarding');
              navigate(ROUTES.ONBOARDING);
            } else {
              navigate(ROUTES.DASHBOARD);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          navigate(ROUTES.SIGNIN);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
};