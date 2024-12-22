import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddressVerificationProps {
  onVerified: (verifiedAddress: any) => void;
}

interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export const AddressVerification = ({ onVerified }: AddressVerificationProps) => {
  const [address, setAddress] = useState<AddressInput>({
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [loading, setLoading] = useState(false);

  const validateAddress = () => {
    if (!address.street || !address.city || !address.state || !address.zip_code) {
      toast.error("Please fill in all address fields");
      return false;
    }

    if (address.state.length !== 2) {
      toast.error("Please enter a valid 2-letter state code");
      return false;
    }

    if (!/^\d{5}(-\d{4})?$/.test(address.zip_code)) {
      toast.error("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
      return false;
    }

    return true;
  };

  const handleVerify = async () => {
    try {
      if (!validateAddress()) return;
      
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
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
        <div>
          <Label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</Label>
          <Input
            id="street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            placeholder="123 Main St"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="City"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
              placeholder="CA"
              maxLength={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="zip_code" className="text-sm font-medium text-gray-700">ZIP Code</Label>
            <Input
              id="zip_code"
              value={address.zip_code}
              onChange={(e) => setAddress({ ...address, zip_code: e.target.value })}
              placeholder="12345"
              className="mt-1"
            />
          </div>
        </div>
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