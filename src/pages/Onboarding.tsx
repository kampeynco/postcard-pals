import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useOnboarding } from "@/components/onboarding/hooks/useOnboarding";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopNav } from "@/components/navigation/TopNav";
import { useEffect } from "react";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingData, currentStep, loading, saveOnboardingState, loadSavedData } = useOnboarding();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadSavedData();
  }, [currentStep]);

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
    <div className="min-h-screen bg-gray-50">
      <TopNav hideNavigation showLogout />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`${isMobile ? 'flex flex-col space-y-8' : 'flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0'}`}>
          {isMobile ? (
            <>
              <div className="w-full">
                <OnboardingProgress currentStep={currentStep} />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow p-6">
                  {renderStep()}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:flex-1">
                <div className="bg-white rounded-lg shadow p-6">
                  {renderStep()}
                </div>
              </div>
              <div className="lg:w-80">
                <OnboardingProgress currentStep={currentStep} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;