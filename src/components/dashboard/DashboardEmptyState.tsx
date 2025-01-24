import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { OnboardingStep } from "./empty-state/OnboardingStep";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingStepData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  formStep: number;
}

export const DashboardEmptyState = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStepData[]>([
    {
      id: 1,
      title: "Create Profile",
      description: "Set up your account details",
      completed: false,
      formStep: 1
    },
    {
      id: 2,
      title: "Campaign Details",
      description: "Tell us about your campaign",
      completed: false,
      formStep: 2
    },
    {
      id: 3,
      title: "Verify Account Address",
      description: "Verify your campaign office address",
      completed: false,
      formStep: 3
    },
    {
      id: 4,
      title: "Connect ActBlue",
      description: "Link your ActBlue account",
      completed: false,
      formStep: 4
    }
  ]);

  useEffect(() => {
    const checkStepCompletion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;

      // Check profile completion
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Check ActBlue account
      const { data: actblueAccount } = await supabase
        .from("actblue_accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setSteps(currentSteps => 
        currentSteps.map(step => ({
          ...step,
          completed: step.id === 1 ? 
            !!(profile?.first_name && profile?.last_name && profile?.phone_number) :
            step.id === 4 ? 
            !!actblueAccount?.is_onboarded :
            false
        }))
      );
    };

    checkStepCompletion();
  }, []);

  const handleStepClick = (step: OnboardingStepData) => {
    if (!step.completed) {
      console.log(`Navigating to onboarding step: ${step.formStep}`);
      navigate(ROUTES.ONBOARDING, { 
        replace: true,
        state: { 
          step: step.formStep 
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Welcome to Thanks From Us!</h2>
        <p className="text-gray-600">Complete these steps to start sending thank you postcards</p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="grid gap-4">
          {steps.map((step) => (
            <OnboardingStep
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              completed={step.completed}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};