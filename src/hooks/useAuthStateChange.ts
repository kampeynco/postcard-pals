import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthStateChange = (callback: (event: string) => void) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast.info('You have been signed out');
      } else if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in');
      }
      callback(event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [callback]);
};