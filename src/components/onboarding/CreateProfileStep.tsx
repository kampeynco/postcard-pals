import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useProfileForm } from "./hooks/useProfileForm";
import { ProfileFormFields } from "./profile/ProfileFormFields";
import { OnboardingData } from "./hooks/useOnboardingState";

interface CreateProfileStepProps {
  onNext: () => void;
  defaultValues?: OnboardingData;
}

export const CreateProfileStep = ({ onNext, defaultValues }: CreateProfileStepProps) => {
  const { form, formatPhoneNumber, onSubmit, session } = useProfileForm(onNext, defaultValues);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Your Profile</h2>
        <p className="text-gray-500 text-sm">Tell us about yourself</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProfileFormFields 
            form={form} 
            formatPhoneNumber={formatPhoneNumber}
            userEmail={session?.user.email}
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