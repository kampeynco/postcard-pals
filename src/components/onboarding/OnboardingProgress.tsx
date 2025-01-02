import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnboardingProgressProps {
  currentStep: number;
}

export const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  const isMobile = useIsMobile();
  
  const steps = [
    {
      number: 1,
      title: "Create Profile",
      description: "Set up your account details"
    },
    {
      number: 2,
      title: "Campaign Details",
      description: "Tell us about your campaign"
    },
    {
      number: 3,
      title: "Integrate ActBlue",
      description: "Grant access to ActBlue"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-8">
        <div className="relative">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className={`relative ${isMobile ? 'pb-6 last:pb-0' : 'pb-12 last:pb-0'} ${
                isMobile ? 'flex items-center space-x-4' : ''
              }`}
            >
              {index !== steps.length - 1 && (
                <div
                  className={`absolute ${
                    isMobile 
                      ? 'top-4 left-4 h-full w-0.5' 
                      : 'left-4 top-8 -ml-px h-full w-0.5'
                  } ${
                    currentStep > step.number ? 'bg-brand-background' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
              <div className={`relative flex ${isMobile ? 'flex-shrink-0' : 'items-start'} group`}>
                <div className="flex-shrink-0">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep > step.number
                        ? 'bg-brand-background'
                        : currentStep === step.number
                        ? 'bg-brand-background'
                        : 'bg-gray-200'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.number}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};