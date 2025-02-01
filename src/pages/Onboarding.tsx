import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { ErrorBoundary } from "@/components/onboarding/ErrorBoundary";

const Onboarding = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        <ErrorBoundary>
          <OnboardingForm />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Onboarding;