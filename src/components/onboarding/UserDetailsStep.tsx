import { Button } from "@/components/ui/button";
import { UserDetailsForm } from "./user-details/UserDetailsForm";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UserDetailsStep({ onNext, onBack }: UserDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tell us about yourself</h2>
        <p className="text-sm text-gray-600">
          This information will help us personalize your experience
        </p>
      </div>

      <UserDetailsForm onSuccess={onNext} />
      
      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}