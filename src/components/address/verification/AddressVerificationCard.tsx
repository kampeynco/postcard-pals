import { Card } from "@/components/ui/card";
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

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Verify Office Address</h3>
      <AddressVerificationForm onVerified={onVerified} />
    </Card>
  );
};