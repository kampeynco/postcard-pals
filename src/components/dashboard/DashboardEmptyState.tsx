import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { OnboardingStep } from "./empty-state/OnboardingStep";

interface OnboardingStepData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  formStep: number;
}

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  const steps: OnboardingStepData[] = [
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
      title: "Connect ActBlue",
      description: "Link your ActBlue account",
      completed: false,
      formStep: 3
    }
  ];

  const handleStepClick = (step: OnboardingStepData) => {
    console.log(`Navigating to onboarding step: ${step.formStep}`);
    navigate(ROUTES.ONBOARDING, { 
      state: { 
        step: step.formStep 
      }
    });
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