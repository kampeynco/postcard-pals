import { useState } from "react";
import { AddressInput, AddressVerificationProps } from "./types";
import { AddressVerificationCard } from "./verification/AddressVerificationCard";

export const AddressVerification = ({ onVerified }: AddressVerificationProps) => {
  const [verifiedAddress, setVerifiedAddress] = useState<AddressInput | null>(null);

  const handleVerified = (address: AddressInput) => {
    setVerifiedAddress(address);
    onVerified(address);
  };

  return <AddressVerificationCard verifiedAddress={verifiedAddress} onVerified={handleVerified} />;
};