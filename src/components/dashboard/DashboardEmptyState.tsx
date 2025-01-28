import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { OnboardingStep } from "./empty-state/OnboardingStep";
import { ONBOARDING_STEPS } from "../onboarding/constants/steps";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const DashboardEmptyState = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardingProgress = async () => {
      try {
        const { data: actBlueAccount } = await supabase
          .from('actblue_accounts')
          .select('is_onboarded, is_created')
          .single();

        if (actBlueAccount) {
          const completed = [];
          if (actBlueAccount.is_created) completed.push(1);
          if (actBlueAccount.is_onboarded) {
            completed.push(2);
            completed.push(3);
          }
          setCompletedSteps(completed);
        }
      } catch (error) {
        console.error('Error fetching onboarding progress:', error);
        toast.error("Failed to load onboarding progress");
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingProgress();
  }, []);

  const handleStepClick = async (formStep: number) => {
    try {
      // Validate step access
      const previousStepCompleted = formStep === 1 || completedSteps.includes(formStep - 1);
      if (!previousStepCompleted) {
        toast.error("Please complete the previous step first");
        return;
      }

      await navigate(ROUTES.ONBOARDING, { 
        state: { step: formStep }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error("Failed to navigate to step");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Welcome to Thanks From Us!</h2>
        <p className="text-gray-600">Complete these steps to start sending thank you postcards</p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="grid gap-4">
          {ONBOARDING_STEPS.map((step) => (
            <OnboardingStep
              key={step.id}
              {...step}
              completed={completedSteps.includes(step.id)}
              onClick={() => handleStepClick(step.formStep)}
              disabled={!completedSteps.includes(step.id - 1) && step.id !== 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};