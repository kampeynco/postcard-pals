import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddressInput } from "../types";
import { validateAddress } from "../utils/validation";

export const useAddressVerification = (onVerified: (address: AddressInput) => void) => {
  const [loading, setLoading] = useState(false);

  const verifyAddress = async (address: AddressInput) => {
    try {
      // Validate address format first
      if (!validateAddress(address)) {
        return;
      }
      
      setLoading(true);
      console.log('Starting address verification for:', address);
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to verify addresses");
        return;
      }

      // Get the user's ActBlue account
      const { data: actblueAccounts, error: actblueError } = await supabase
        .from('actblue_accounts')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (actblueError) {
        console.error('Error fetching ActBlue account:', actblueError);
        toast.error("Failed to verify address. Please try again.");
        return;
      }

      if (!actblueAccounts) {
        toast.error("Please set up your ActBlue account first");
        return;
      }

      // Call verification endpoint
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

      if (data.error) {
        toast.error(data.error.message || "Address verification failed");
        return;
      }

      if (data.is_verified) {
        // Save verified address
        const { error: saveError } = await supabase
          .from('addresses')
          .insert({
            actblue_account_id: actblueAccounts.id,
            lob_id: data.object,
            address_data: data,
            is_verified: true,
            last_verified_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving address:', saveError);
          toast.error("Failed to save verified address");
          return;
        }

        const verifiedAddress = {
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        };

        onVerified(verifiedAddress);
        toast.success("Address verified successfully!");
      } else {
        toast.error(`Address verification failed: ${data.deliverability}`);
      }
    } catch (error) {
      console.error('Error in address verification:', error);
      toast.error("Failed to verify address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyAddress
  };
};