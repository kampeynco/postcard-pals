import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/components/onboarding/hooks/useOnboarding";
import { useIsMobile } from "@/hooks/use-mobile";
import MainLayout from "@/components/layout/MainLayout";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingData, currentStep, loading, saveOnboardingState } = useOnboarding();
  const isMobile = useIsMobile();

  if (loading) {
    return <div>Loading...</div>;
  }

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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${isMobile ? 'space-y-8' : 'lg:flex-row lg:space-x-8'}`}>
          <div className={`${isMobile ? 'order-first' : 'lg:w-80'} ${
            isMobile ? 'mb-8' : ''
          }`}>
            <OnboardingProgress currentStep={currentStep} />
          </div>
          
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Onboarding;