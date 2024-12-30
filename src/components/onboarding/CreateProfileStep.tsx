import { Button } from "@/components/ui/button";
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
      <ProfileFormFields form={form} />
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
