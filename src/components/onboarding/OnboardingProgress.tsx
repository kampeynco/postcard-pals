import { Check } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
}

export const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  const steps = [
    "Create Profile",
    "Campaign Details",
    "Integrate ActBlue"
  ];

  return (
    <div className="flex flex-col gap-8 pr-12 border-r border-gray-200 min-w-[200px]">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              currentStep > index + 1
                ? "bg-brand-background text-white"
                : currentStep === index + 1
                ? "bg-brand-background text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {currentStep > index + 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm font-medium">
                {index + 1}
              </span>
            )}
          </div>
          <span
            className={`text-sm ${
              currentStep === index + 1 
                ? "text-gray-900 font-medium" 
                : currentStep > index + 1
                ? "text-brand-background font-medium"
                : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};