import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AddressForm } from "./AddressForm";
import { validateAddress } from "./utils/validation";
import { AddressInput, AddressVerificationProps } from "./types";

export const AddressVerification = ({ onVerified }: AddressVerificationProps) => {
  const [address, setAddress] = useState<AddressInput>({
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState<AddressInput | null>(null);

  const handleVerify = async () => {
    try {
      if (!validateAddress(address)) return;
      
      setLoading(true);
      console.log('Starting address verification for:', address);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication required");
        return;
      }

      // For testing, if the street contains a test keyword, set zip_code to "11111"
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
        // For test addresses, we'll use a standard city/state if not provided
        if (!testAddress.city || !testAddress.state) {
          testAddress.city = 'San Francisco';
          testAddress.state = 'CA';
        }
      }

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
        const verified = {
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        };
        setVerifiedAddress(verified);
        toast.success("Address verified successfully!");
        onVerified(verified);
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

  if (verifiedAddress) {
    return (
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Verified Address</h3>
        <div className="space-y-2 text-gray-700">
          <p>{verifiedAddress.street}</p>
          <p>{verifiedAddress.city}, {verifiedAddress.state} {verifiedAddress.zip_code}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Verify Address</h3>
      <div className="space-y-4">
        <AddressForm address={address} onChange={setAddress} />
        <Button 
          onClick={handleVerify} 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? "Verifying..." : "Verify Address"}
        </Button>
      </div>
    </Card>
  );
};