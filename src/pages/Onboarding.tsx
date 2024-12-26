import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useOnboardingState } from "@/components/onboarding/hooks/useOnboardingState";

const OnboardingTopBar = () => (
  <div className="bg-[#4B5EE4]">
    <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-4">
      <span className="text-white font-semibold text-lg">Thanks From Us</span>
    </div>
  </div>
);

const Onboarding = () => {
  const location = useLocation();
  const { onboardingData, currentStep, loading, saveOnboardingState } = useOnboardingState();

  useEffect(() => {
    if (location.state?.step) {
      saveOnboardingState(onboardingData, location.state.step);
    }
  }, [location.state]);

  const handleNext = () => {
    saveOnboardingState(onboardingData, currentStep + 1);
  };

  const handleBack = () => {
    saveOnboardingState(onboardingData, Math.max(1, currentStep - 1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <OnboardingTopBar />
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-12">
          <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
            {currentStep === 1 && (
              <CreateProfileStep 
                onNext={handleNext} 
                defaultValues={onboardingData}
              />
            )}
            {currentStep === 2 && (
              <CampaignDetailsStep 
                onNext={handleNext} 
                onBack={handleBack}
                defaultValues={onboardingData}
              />
            )}
            {currentStep === 3 && (
              <IntegrateActBlueStep 
                onNext={handleNext} 
                onBack={handleBack}
              />
            )}
          </div>
          <div className="w-80">
            <OnboardingProgress currentStep={currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;