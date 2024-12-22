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

      // Call verification endpoint directly without checking for ActBlue account
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