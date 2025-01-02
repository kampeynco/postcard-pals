import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ProfileFormFields() {
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
              <Input {...field} placeholder="(XXX) XXX-XXXX" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}