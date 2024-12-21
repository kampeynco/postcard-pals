import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserDetailsFields } from "./UserDetailsFields";
import { UserDetailsFormValues } from "./types";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
});

interface UserDetailsFormProps {
  onSuccess: () => void;
}

export function UserDetailsForm({ onSuccess }: UserDetailsFormProps) {
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

      toast.success("Profile updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <UserDetailsFields form={form} />
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-brand-background text-brand-text px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-base font-medium"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}