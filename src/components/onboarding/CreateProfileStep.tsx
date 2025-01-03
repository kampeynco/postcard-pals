import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";

interface CreateProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CreateProfileStep({ onNext, onBack }: CreateProfileStepProps) {
  const { form } = useOnboarding();

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
          <ProfileFormFields />
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