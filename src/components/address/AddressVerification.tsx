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

export const AddressVerification = ({ onVerified }: AddressVerificationProps) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { data, error } = await supabase.functions.invoke('verify-address', {
        body: { address },
        headers: {
          'x-user-id': user.id
        }
      });

      if (error) throw error;

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
      toast.error("Failed to verify address");
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
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              placeholder="CA"
              maxLength={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code</Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
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