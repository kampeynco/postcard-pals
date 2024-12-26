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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserDetailsFieldsProps {
  form: UseFormReturn<UserDetailsFormValues>;
  defaultValues?: Partial<UserDetailsFormValues>;
}

export function UserDetailsFields({ form, defaultValues }: UserDetailsFieldsProps) {
  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          defaultValue={defaultValues?.first_name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-medium">Campaign name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your campaign name" 
                  className="h-11 border-gray-200 focus:border-brand-background focus:ring-brand-background" 
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
          defaultValue={defaultValues?.last_name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-medium">
                Description of campaign
                <span className="block text-gray-400 text-xs font-normal mt-0.5">
                  Helpful description
                </span>
              </FormLabel>
              <FormControl>
                <textarea 
                  className="w-full min-h-[120px] rounded-md border border-gray-200 focus:border-brand-background focus:ring-brand-background p-3 text-sm"
                  placeholder="Tell us about your campaign"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          defaultValue={defaultValues?.phone_number}
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-sm font-medium">
                Campaign type
                <span className="block text-gray-400 text-xs font-normal mt-0.5">
                  Helpful description
                </span>
              </FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={onChange} 
                  defaultValue={field.value}
                  className="grid gap-4"
                >
                  <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                    <RadioGroupItem value="federal" id="federal" />
                    <label htmlFor="federal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Federal Campaign
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                    <RadioGroupItem value="state" id="state" />
                    <label htmlFor="state" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      State Campaign
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                    <RadioGroupItem value="local" id="local" />
                    <label htmlFor="local" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Local Campaign
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}