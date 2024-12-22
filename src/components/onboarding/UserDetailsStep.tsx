import { UserDetailsForm } from "./user-details/UserDetailsForm";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UserDetailsStep({ onNext }: UserDetailsStepProps) {
  return (
    <div className="space-y-8 max-w-[640px] mx-auto">
      <div>
        <div className="flex items-center justify-center space-x-2 mb-12">
          <div className="w-3 h-3 rounded-full bg-brand-background"></div>
          <div className="w-32 h-[2px] bg-gray-200"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
          <div className="w-32 h-[2px] bg-gray-200"></div>
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">About your campaign</h2>
        <p className="text-gray-500 text-sm">
          Tell us about your campaign so we can personalize your experience
        </p>
      </div>

      <UserDetailsForm onSuccess={onNext} />
    </div>
  );
}