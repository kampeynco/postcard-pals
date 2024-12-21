import { UserDetailsForm } from "./user-details/UserDetailsForm";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UserDetailsStep({ onNext }: UserDetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-600 mt-2">
          This information will help us personalize your experience
        </p>
      </div>

      <UserDetailsForm onSuccess={onNext} />
    </div>
  );
}