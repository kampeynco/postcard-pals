import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressInput } from "./types";

interface AddressFormProps {
  address: AddressInput;
  onChange: (address: AddressInput) => void;
}

export const AddressForm = ({ address, onChange }: AddressFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</Label>
        <Input
          id="street"
          value={address.street}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
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
            onChange={(e) => onChange({ ...address, city: e.target.value })}
            placeholder="City"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
          <Input
            id="state"
            value={address.state}
            onChange={(e) => onChange({ ...address, state: e.target.value.toUpperCase() })}
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
            onChange={(e) => onChange({ ...address, zip_code: e.target.value })}
            placeholder="12345"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};