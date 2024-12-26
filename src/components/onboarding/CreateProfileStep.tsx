import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProfileStepProps {
  onNext: () => void;
}

export const CreateProfileStep = ({ onNext }: CreateProfileStepProps) => {
  const { session } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  });

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Starting profile update with values:", values);
      
      if (!session?.user?.id) {
        console.error("No user session found");
        toast.error("Please sign in to continue");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          is_confirmed: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", session.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("Profile updated successfully");
      toast.success("Profile updated successfully");
      onNext();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Your Profile</h2>
        <p className="text-gray-500 text-sm">Tell us about yourself</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              value={session?.user.email} 
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

          <Button 
            type="submit" 
            className="w-full bg-brand-background hover:bg-brand-background/90 text-white font-medium py-2.5"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};