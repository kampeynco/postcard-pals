import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { useOnboarding } from "@/components/onboarding/hooks/useOnboarding";
import { FormProvider } from 'react-hook-form';
import { ErrorBoundary } from "@/components/onboarding/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useEffect } from "react"; // Added this import

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, loading, saveOnboardingState, form } = useOnboarding();

  useEffect(() => {
    const state = location.state as { step?: number };
    if (state?.step && state.step !== currentStep) {
      console.log(`Setting onboarding step to: ${state.step}`);
      saveOnboardingState({}, state.step);
    }
  }, [location.state, currentStep, saveOnboardingState]);

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    await saveOnboardingState({}, nextStep);

    if (nextStep > 3) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(ROUTES.DASHBOARD);
    } else {
      const prevStep = Math.max(1, currentStep - 1);
      saveOnboardingState({}, prevStep);
    }
  };

  const renderStep = () => {
    if (loading && !currentStep) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      );
    }

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
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6">
        <ErrorBoundary>
          <FormProvider {...form}>
            {renderStep()}
          </FormProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Onboarding;