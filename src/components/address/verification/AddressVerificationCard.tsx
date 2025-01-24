import { AddressInput } from "../types";
import { VerifiedAddressDisplay } from "./VerifiedAddressDisplay";
import { AddressVerificationForm } from "./AddressVerificationForm";

interface AddressVerificationCardProps {
  verifiedAddress: AddressInput | null;
  onVerified: (address: AddressInput) => void;
}

export const AddressVerificationCard = ({ verifiedAddress, onVerified }: AddressVerificationCardProps) => {
  if (verifiedAddress) {
    return <VerifiedAddressDisplay address={verifiedAddress} />;
  }

  return <AddressVerificationForm onVerified={onVerified} />;
};