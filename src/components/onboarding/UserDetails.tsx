import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
export interface UserDetailsFormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface UserDetailsProps {
  onSuccess: () => void;
  defaultValues?: Partial<UserDetailsFormValues>;
}

// Main component
export const UserDetails = ({ onSuccess, defaultValues }: UserDetailsProps) => {
  const form = useForm<UserDetailsFormValues>({
    defaultValues: {
      first_name: defaultValues?.first_name || "",
      last_name: defaultValues?.last_name || "",
      phone_number: defaultValues?.phone_number || "",
    },
  });

  const onSubmit = async (values: UserDetailsFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="first_name"
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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 text-sm font-medium">
                  Campaign type
                  <span className="block text-gray-400 text-xs font-normal mt-0.5">
                    Select your campaign type
                  </span>
                </FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="grid gap-4"
                  >
                    <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                      <RadioGroupItem value="federal" id="federal" />
                      <label htmlFor="federal" className="text-sm font-medium leading-none">
                        Federal Campaign
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                      <RadioGroupItem value="state" id="state" />
                      <label htmlFor="state" className="text-sm font-medium leading-none">
                        State Campaign
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border border-gray-200 p-4 rounded-md">
                      <RadioGroupItem value="local" id="local" />
                      <label htmlFor="local" className="text-sm font-medium leading-none">
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

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-[#4361ee] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-base font-medium w-full justify-center"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};