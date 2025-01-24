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

      // First, get the user's ActBlue account ID
      const { data: actBlueAccount, error: accountError } = await supabase
        .from('actblue_accounts')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (accountError) {
        console.error('Error fetching ActBlue account:', accountError);
        toast.error("Unable to find your ActBlue account. Please complete your campaign setup first.");
        return;
      }

      if (!actBlueAccount) {
        console.log('No ActBlue account found for user:', session.user.id);
        toast.error("Please complete your campaign setup before verifying addresses.");
        return;
      }

      const { data, error } = await supabase.functions.invoke('verify-address', {
        body: { address }
      });

      console.log('Verification response:', data);

      if (error) {
        console.error('Verification error:', error);
        toast.error(error.message || "Failed to verify address");
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

        // Save verified address to Supabase with the correct ActBlue account ID
        const { error: saveError } = await supabase
          .from('addresses')
          .upsert({
            actblue_account_id: actBlueAccount.id,
            lob_id: data.lob_id,
            address_data: verifiedAddress,
            is_verified: true,
            last_verified_at: new Date().toISOString()
          }, {
            onConflict: 'actblue_account_id'
          });

        if (saveError) {
          console.error('Error saving verified address:', saveError);
          const errorMessage = saveError.message || "Unable to save address";
          toast.error(`Failed to save verified address: ${errorMessage}. Please try again later.`);
          return;
        }

        onVerified(verifiedAddress);
        toast.success("Address verified and saved successfully!");
      } else {
        const message = data.deliverability 
          ? `Address verification failed: ${data.deliverability}` 
          : "Address verification failed";
        toast.error(message);
      }
    } catch (error) {
      console.error('Error in address verification:', error);
      toast.error("Failed to verify address. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyAddress
  };
};