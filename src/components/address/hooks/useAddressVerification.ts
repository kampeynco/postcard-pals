import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddressInput } from "../types";
import { validateAddress } from "../utils/validation";

export const useAddressVerification = (onVerified: (address: AddressInput) => void) => {
  const [loading, setLoading] = useState(false);

  const verifyAddress = async (address: AddressInput) => {
    try {
      if (!validateAddress(address)) return;
      
      setLoading(true);
      console.log('Starting address verification for:', address);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication required");
        return;
      }

      // Get the user's ActBlue account
      const { data: actblueAccounts, error: actblueError } = await supabase
        .from('actblue_accounts')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (actblueError || !actblueAccounts) {
        toast.error("Please set up your ActBlue account first");
        return;
      }

      // Handle test cases
      const testAddress = handleTestCases(address);

      const { data, error } = await supabase.functions.invoke('verify-address', {
        body: { address: testAddress }
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
        await saveVerifiedAddress(data, actblueAccounts.id);
        const verified = {
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        };
        onVerified(verified);
        toast.success("Address verified and saved successfully!");
      } else {
        toast.error(`Address verification failed: ${data.deliverability}`);
      }
    } catch (error) {
      console.error('Error verifying address:', error);
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

// Helper functions
const handleTestCases = (address: AddressInput) => {
  const testAddress = { ...address };
  const testKeywords = [
    'commercial highrise',
    'residential highrise',
    'residential house',
    'po box',
    'rural route',
    'puerto rico',
    'military',
    'department of state',
    'deliverable',
    'missing unit',
    'incorrect unit',
    'unnecessary unit',
    'undeliverable block match',
    'undeliverable no match'
  ];

  if (testKeywords.some(keyword => 
    address.street.toLowerCase().includes(keyword.toLowerCase()))) {
    testAddress.zip_code = '11111';
    if (!testAddress.city || !testAddress.state) {
      testAddress.city = 'San Francisco';
      testAddress.state = 'CA';
    }
  }

  return testAddress;
};

const saveVerifiedAddress = async (data: any, actblueAccountId: string) => {
  const { error: saveError } = await supabase
    .from('addresses')
    .insert({
      actblue_account_id: actblueAccountId,
      lob_id: data.object,
      address_data: data,
      is_verified: true,
      last_verified_at: new Date().toISOString()
    });

  if (saveError) {
    console.error('Error saving address:', saveError);
    throw new Error("Failed to save verified address");
  }
};