import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../hooks/useProfileForm";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  formatPhoneNumber: (value: string) => string;
  userEmail?: string;
}

export const ProfileFormFields = ({ form, formatPhoneNumber, userEmail }: ProfileFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">First Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your first name" 
                className="border-gray-200 focus:border-brand-background focus:ring-brand-background" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Last Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your last name" 
                className="border-gray-200 focus:border-brand-background focus:ring-brand-background" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel className="text-gray-700">Email</FormLabel>
        <Input 
          value={userEmail} 
          disabled 
          className="bg-gray-50 border-gray-200"
        />
      </div>

      <FormField
        control={form.control}
        name="phone_number"
        render={({ field: { onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Mobile Phone</FormLabel>
            <FormControl>
              <Input
                placeholder="(555) 555-5555"
                className="border-gray-200 focus:border-brand-background focus:ring-brand-background"
                {...field}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  onChange(formatted);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};