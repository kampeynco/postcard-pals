import { Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  path: string;
}

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Create Profile",
      description: "Set up your account details",
      completed: false,
      path: "/onboarding"
    },
    {
      id: 2,
      title: "Campaign Details",
      description: "Tell us about your campaign",
      completed: false,
      path: "/onboarding"
    },
    {
      id: 3,
      title: "Connect ActBlue",
      description: "Link your ActBlue account",
      completed: false,
      path: "/onboarding"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Welcome to Thanks From Us!</h2>
        <p className="text-gray-600">Complete these steps to start sending thank you postcards</p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-background transition-colors"
            >
              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-brand-background text-white">
                {step.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{step.id}</span>
                )}
              </div>

              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>

              <Button
                variant="ghost"
                className="flex items-center text-brand-background hover:text-brand-background/80"
                onClick={() => navigate(step.path)}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};