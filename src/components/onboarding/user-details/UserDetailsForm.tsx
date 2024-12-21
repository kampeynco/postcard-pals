import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserDetailsFields } from "./UserDetailsFields";
import { UserDetailsFormValues } from "./types";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
});

interface UserDetailsFormProps {
  onSuccess: () => void;
}

export function UserDetailsForm({ onSuccess }: UserDetailsFormProps) {
  const { toast } = useToast();
  const form = useForm<UserDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
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

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <UserDetailsFields form={form} />
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-brand-background text-brand-text px-6 py-2.5 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          Continue
          <span className="inline-block">→</span>
        </button>
      </div>
    </form>
  );
}