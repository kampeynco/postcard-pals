import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-12">
          <OnboardingProgress currentStep={step} />
          <div className="flex-1 max-w-[640px]">
            {step === 1 && <CreateProfileStep onNext={handleNext} />}
            {step === 2 && <CampaignDetailsStep onNext={handleNext} />}
            {step === 3 && <IntegrateActBlueStep onNext={handleNext} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;