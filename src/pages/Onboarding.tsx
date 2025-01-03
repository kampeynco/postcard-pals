import { useState } from "react";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { TopNav } from "@/components/navigation/TopNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const isMobile = useIsMobile();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreateProfileStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <CampaignDetailsStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <IntegrateActBlueStep onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav hideNavigation showLogout />
      
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {isMobile && (
            <div className="mb-8">
              <OnboardingProgress currentStep={currentStep} />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8">
            {!isMobile && (
              <div className="md:col-span-1">
                <OnboardingProgress currentStep={currentStep} />
              </div>
            )}
            
            <div className="md:col-span-1 bg-white shadow rounded-lg p-6">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;