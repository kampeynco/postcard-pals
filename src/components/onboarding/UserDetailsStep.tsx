import { UserDetailsForm } from "./user-details/UserDetailsForm";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UserDetailsStep({ onNext }: UserDetailsStepProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Tell us about yourself</h2>
        <p className="text-sm text-gray-600 mt-1">
          This information will help us personalize your experience
        </p>
      </div>

      <UserDetailsForm onSuccess={onNext} />
    </div>
  );
}