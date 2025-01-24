import { ProfileFormFields } from "./profile/ProfileFormFields";
import { useOnboarding } from "./hooks/useOnboarding";
import { StepWrapper } from "./steps/StepWrapper";

interface CreateProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CreateProfileStep({ onNext, onBack }: CreateProfileStepProps) {
  const { form } = useOnboarding();

  const handleSubmit = async () => {
    await form.trigger();
    if (form.formState.isValid) {
      await onNext();
    }
  };

  return (
    <StepWrapper
      title="Create Your Profile"
      description="Set up your account details to get started"
      onNext={handleSubmit}
      onBack={onBack}
      isSubmitting={form.formState.isSubmitting}
    >
      <ProfileFormFields />
    </StepWrapper>
  );
}