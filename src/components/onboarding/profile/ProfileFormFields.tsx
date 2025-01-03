import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "../hooks/useOnboarding";

export function ProfileFormFields() {
  const { formatPhoneNumber } = useOnboarding();

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
                {...field}
                placeholder="(XXX) XXX-XXXX"
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}