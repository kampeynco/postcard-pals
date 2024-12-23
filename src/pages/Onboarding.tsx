import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

const OnboardingTopBar = () => (
  <div className="bg-[#4B5EE4]">
    <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-4">
      <span className="text-white font-semibold text-lg">Thanks From Us</span>
    </div>
  </div>
);

const Onboarding = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (location.state?.step) {
      setStep(location.state.step);
    }
  }, [location.state]);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <OnboardingTopBar />
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-12">
          <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
            {step === 1 && <CreateProfileStep onNext={handleNext} />}
            {step === 2 && <CampaignDetailsStep onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <IntegrateActBlueStep onNext={handleNext} onBack={handleBack} />}
          </div>
          <div className="w-80">
            <OnboardingProgress currentStep={step} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;