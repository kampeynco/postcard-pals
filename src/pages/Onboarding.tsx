import { useState } from "react";
import { UserDetailsStep } from "@/components/onboarding/UserDetailsStep";
import { ActBlueStep } from "@/components/onboarding/ActBlueStep";
import { PostcardStep } from "@/components/onboarding/PostcardStep";

const Onboarding = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl">
          {step === 1 && (
            <UserDetailsStep onNext={handleNext} onBack={handleBack} />
          )}
          {step === 2 && (
            <ActBlueStep onNext={handleNext} onBack={handleBack} />
          )}
          {step === 3 && (
            <PostcardStep onNext={handleNext} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;