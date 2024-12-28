import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateProfileStep } from "@/components/onboarding/CreateProfileStep";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { PostcardStep } from "@/components/onboarding/PostcardStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useOnboardingState } from "@/components/onboarding/hooks/useOnboardingState";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const OnboardingTopBar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate(ROUTES.SIGNIN);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-[#4B5EE4]">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <span className="text-white font-semibold text-lg">Thanks From Us</span>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-white hover:text-gray-200 flex items-center gap-2 disabled:opacity-50"
        >
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const location = useLocation();
  const { onboardingData, currentStep, loading, saveOnboardingState } = useOnboardingState();

  useEffect(() => {
    if (location.state?.step) {
      saveOnboardingState(onboardingData, location.state.step);
    }
  }, [location.state, onboardingData, saveOnboardingState]);

  const handleNext = () => {
    saveOnboardingState(onboardingData, currentStep + 1);
  };

  const handleBack = () => {
    saveOnboardingState(onboardingData, Math.max(1, currentStep - 1));
  };

  if (loading) {
    return <LoadingSpinner />;
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
              <PostcardStep
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={onboardingData}
              />
            )}
            {currentStep === 4 && (
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