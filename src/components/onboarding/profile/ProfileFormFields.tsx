import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export function ProfileFormFields() {
  const form = useFormContext();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 10) return;
    const formattedPhone = formatPhoneNumber(value);
    form.setValue('phone_number', formattedPhone);
  };

  const formatPhoneNumber = (value: string) => {
    if (value.length <= 3) return value ? `(${value}` : "";
    if (value.length <= 6) return `(${value.slice(0, 3)}) ${value.slice(3)}`;
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  };

  return (
    <div className="space-y-4">
      <FormField
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your first name" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your last name" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                onChange={handlePhoneChange}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}