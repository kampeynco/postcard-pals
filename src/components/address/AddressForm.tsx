import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressInput } from "./types";
import { US_STATES } from "./utils/constants";

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
          <Select
            value={address.state}
            onValueChange={(value) => onChange({ ...address, state: value })}
          >
            <SelectTrigger id="state" className="mt-1">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map(({ code, name }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zip_code" className="text-sm font-medium text-gray-700">ZIP Code</Label>
          <Input
            id="zip_code"
            value={address.zip_code}
            onChange={(e) => onChange({ ...address, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5) })}
            placeholder="12345"
            maxLength={5}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};