import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "../AddressForm";
import { AddressInput } from "../types";
import { useAddressVerification } from "../hooks/useAddressVerification";

interface AddressVerificationFormProps {
  onVerified: (address: AddressInput) => void;
}

export const AddressVerificationForm = ({ onVerified }: AddressVerificationFormProps) => {
  const [address, setAddress] = useState<AddressInput>({
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const { loading, verifyAddress } = useAddressVerification(onVerified);

  const handleVerify = () => {
    verifyAddress(address);
  };

  return (
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
  );
};