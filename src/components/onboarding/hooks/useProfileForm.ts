import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { OnboardingData } from "./useOnboardingState";

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone_number: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export const useProfileForm = (onNext: () => void, defaultValues?: OnboardingData) => {
  const { session } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: defaultValues?.first_name || "",
      last_name: defaultValues?.last_name || "",
      phone_number: defaultValues?.phone_number || "",
    },
  });

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const onSubmit = async (values: ProfileFormValues) => {
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

  return {
    form,
    formatPhoneNumber,
    onSubmit,
    session
  };
};