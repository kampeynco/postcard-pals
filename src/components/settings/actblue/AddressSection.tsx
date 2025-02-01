import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

interface AddressSectionProps {
  form: UseFormReturn<FormValues>;
}

export const AddressSection = ({ form }: AddressSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="street_address"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input {...field} placeholder="Enter street address" />
          </div>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>City</Label>
              <Input {...field} placeholder="City" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>State</Label>
              <Input {...field} placeholder="State" maxLength={2} className="uppercase" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>ZIP Code</Label>
              <Input {...field} placeholder="ZIP code" />
            </div>
          )}
        />
      </div>
    </div>
  );
};