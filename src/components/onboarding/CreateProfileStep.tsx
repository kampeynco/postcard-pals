import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";
import { useAuth } from "@/components/auth/Auth";

interface CreateProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CreateProfileStep({ onNext, onBack }: CreateProfileStepProps) {
  const { form } = useOnboarding();
  const { session } = useAuth();

  const handleSubmit = async (data: any) => {
    await form.trigger();
    if (form.formState.isValid) {
      await onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Create Your Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-brand-background focus:ring-brand-background sm:text-sm"
              />
            </div>
            <ProfileFormFields />
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}