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
    <div className="min-h-screen bg-gradient-to-br from-brand-background to-brand-accent/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
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