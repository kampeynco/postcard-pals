import { Card } from "@/components/ui/card";
import { AddressInput } from "../types";

interface VerifiedAddressDisplayProps {
  address: AddressInput;
}

export const VerifiedAddressDisplay = ({ address }: VerifiedAddressDisplayProps) => {
  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100">
      <div className="space-y-2 text-gray-700">
        <h3 className="text-lg font-medium text-gray-900">Office Address</h3>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zip_code}</p>
      </div>
    </Card>
  );
};