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

  const handleVerify = async () => {
    try {
      if (!validateAddress(address)) return;
      
      setLoading(true);
      console.log("Verifying address:", address);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication required");
        return;
      }

      const { data, error } = await supabase.functions.invoke('verify-address', {
        body: { address },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Verification response:", data);

      if (error) {
        console.error("Verification error:", error);
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
        toast.success("Address verified successfully!");
        onVerified({
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code
        });
      } else {
        toast.error("Could not verify address. Please check the details.");
      }
    } catch (error) {
      console.error('Error verifying address:', error);
      toast.error("Failed to verify address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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