import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddressInput } from "../types";
import { validateAddress } from "../utils/validation";

export const useAddressVerification = (onVerified: (address: AddressInput) => void) => {
  const [loading, setLoading] = useState(false);

  const verifyAddress = async (address: AddressInput) => {
    try {
      if (!validateAddress(address)) {
        return;
      }
      
      setLoading(true);
      console.log('Starting address verification for:', address);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to verify addresses");
        return;
      }

      // First, fetch the ActBlue account
      const { data: actblueAccount, error: actblueError } = await supabase
        .from('actblue_accounts')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (actblueError) {
        console.error('Error fetching ActBlue account:', actblueError);
        if (actblueError.code === 'PGRST116') {
          toast.error("Please complete your ActBlue account setup first");
        } else {
          toast.error("Unable to verify address. Please try again later.");
        }
        return;
      }

      if (!actblueAccount) {
        toast.error("Please set up your ActBlue account first");
        return;
      }

      // Proceed with address verification
      const { data, error } = await supabase.functions.invoke('verify-address', {
        body: { address }
      });

      console.log('Verification response:', data);

      if (error) {
        console.error('Verification error:', error);
        toast.error("Unable to verify address. Please try again later.");
        return;
      }

      if (!data) {
        toast.error("No response from address verification service");
        return;
      }

      if (!data.success) {
        const errorMessage = data.error?.message || "Address verification failed";
        const details = data.error?.details?.deliverability_analysis || {};
        
        let detailedError = errorMessage;
        if (details.dpv_confirmation === 'N') {
          detailedError += ": Address not found";
        } else if (details.dpv_vacant === 'Y') {
          detailedError += ": Address is vacant";
        } else if (details.dpv_active === 'N') {
          detailedError += ": Address is not active";
        }
        
        toast.error(detailedError);
        return;
      }

      if (data.is_verified) {
        const verifiedAddress = {
          street: data.street || address.street,
          city: data.city || address.city,
          state: data.state || address.state,
          zip_code: data.zip_code || address.zip_code
        };

        try {
          // Save verified address to Supabase
          const { error: saveError } = await supabase
            .from('addresses')
            .upsert({
              actblue_account_id: actblueAccount.id,
              address_data: verifiedAddress,
              is_verified: true,
              last_verified_at: new Date().toISOString(),
              lob_id: data.lob_id
            });

          if (saveError) {
            console.error('Error saving verified address:', saveError);
            toast.error("Unable to save verified address. Please try again later.");
            return;
          }

          onVerified(verifiedAddress);
          toast.success("Address verified and saved successfully!");
        } catch (error) {
          console.error('Error saving verified address:', error);
          toast.error("Unable to save verified address. Please try again later.");
        }
      } else {
        const message = data.deliverability 
          ? `Address verification failed: ${data.deliverability}` 
          : "Address verification failed";
        toast.error(message);
      }
    } catch (error) {
      console.error('Error in address verification:', error);
      toast.error("Unable to verify address. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyAddress
  };
};