import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/Auth";
import { useEffect } from "react";
import { useOnboarding } from "./hooks/useOnboarding";

export function UserDetails() {
  const { session } = useAuth();
  const { form, formatPhoneNumber } = useOnboarding();

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setValue("phone_number", formatted);
  };

  return (
    <div className="space-y-4">
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={session?.user?.email || ""} 
                disabled 
                className="bg-gray-100"
              />
            </FormControl>
          </FormItem>
        )}
      />

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
                onChange={handlePhoneChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}