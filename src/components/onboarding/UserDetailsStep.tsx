import { UserDetails } from "./UserDetails";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "./hooks/useOnboarding";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const UserDetailsStep = ({ onNext, onBack }: UserDetailsStepProps) => {
  const { form } = useOnboarding();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">User Details</h2>
      <p className="text-sm text-gray-600">Please provide your details to proceed.</p>
      <UserDetails form={form} />
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
