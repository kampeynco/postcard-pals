import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/components/onboarding/hooks/useOnboarding";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingData, currentStep, loading, saveOnboardingState } = useOnboarding();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    await saveOnboardingState({}, nextStep);

    if (nextStep > 3) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleBack = () => {
    const prevStep = Math.max(1, currentStep - 1);
    saveOnboardingState({}, prevStep);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateProfileStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CampaignDetailsStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <IntegrateActBlueStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <OnboardingProgress currentStep={currentStep} />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;