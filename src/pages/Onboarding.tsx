import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CampaignDetailsStep } from "@/components/onboarding/CampaignDetailsStep";
import { VerifyAddressStep } from "@/components/onboarding/VerifyAddressStep";
import { IntegrateActBlueStep } from "@/components/onboarding/IntegrateActBlueStep";
import { useOnboarding } from "@/components/onboarding/hooks/useOnboarding";
import { FormProvider } from 'react-hook-form';
import { ErrorBoundary } from "@/components/onboarding/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, loading, saveOnboardingState, form, resetForm } = useOnboarding();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    const checkStepAccess = async () => {
      try {
        const { data: actBlueAccount } = await supabase
          .from('actblue_accounts')
          .select('is_created, is_onboarded')
          .maybeSingle();

        const state = location.state as { step?: number };
        const requestedStep = state?.step || 1;

        // Determine which steps are accessible
        const completedSteps = [];
        if (actBlueAccount?.is_created) completedSteps.push(1);
        if (actBlueAccount?.is_onboarded) {
          completedSteps.push(2);
          completedSteps.push(3);
        }

        // Check if the requested step is accessible
        const previousStepCompleted = requestedStep === 1 || completedSteps.includes(requestedStep - 1);
        
        if (!previousStepCompleted) {
          console.log('Redirecting to dashboard: previous step not completed');
          toast.error("Please complete the previous steps first");
          navigate(ROUTES.DASHBOARD);
          return;
        }

        // Set the current step in the onboarding state
        await saveOnboardingState({}, requestedStep);
      } catch (error) {
        console.error('Error checking step access:', error);
        toast.error("Failed to verify step access");
        navigate(ROUTES.DASHBOARD);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkStepAccess();
  }, [location.state, navigate, saveOnboardingState]);

  if (loading || isCheckingAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const handleNext = async () => {
    try {
      const nextStep = currentStep + 1;
      await saveOnboardingState({}, nextStep);

      if (nextStep > 3) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast.error("Failed to proceed to next step");
    }
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CampaignDetailsStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <VerifyAddressStep
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
        navigate(ROUTES.DASHBOARD);
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