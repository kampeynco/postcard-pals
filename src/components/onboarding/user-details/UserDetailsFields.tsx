import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserDetailsFormValues } from "./types";

interface UserDetailsFieldsProps {
  form: UseFormReturn<UserDetailsFormValues>;
}

export function UserDetailsFields({ form }: UserDetailsFieldsProps) {
  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your first name" 
                    className="border-gray-200 focus:border-brand-background focus:ring-brand-background h-12" 
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
                <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your last name" 
                    className="border-gray-200 focus:border-brand-background focus:ring-brand-background h-12" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Mobile Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="(555) 555-5555"
                  className="border-gray-200 focus:border-brand-background focus:ring-brand-background h-12" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}