import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import { UserDetailsStep } from "@/components/onboarding/UserDetailsStep";
import { ActBlueStep } from "@/components/onboarding/ActBlueStep";
import { PostcardStep } from "@/components/onboarding/PostcardStep";
import { IntegrationStep } from "@/components/onboarding/IntegrationStep";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { OnboardingStep } from "@/types/auth";
import { ErrorBoundary } from "@/components/monitoring/ErrorBoundary";

const steps: OnboardingStep[] = [
  { title: "User Details", component: UserDetailsStep },
  { title: "ActBlue Account", component: ActBlueStep },
  { title: "Postcard Design", component: PostcardStep },
  { title: "Integration", component: IntegrationStep },
];

const useOnboardingProgress = () => {
  const [progress, setProgress] = useState<Record<number, any>>(() => {
    const saved = localStorage.getItem('onboarding-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify(progress));
  }, [progress]);

  return [progress, setProgress] as const;
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useOnboardingProgress();
  const { loading } = useAuth();
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  const handleStepComplete = (data: any) => {
    setStepData(prev => ({
      ...prev,
      [currentStep]: data
    }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to PostCard</h1>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className={`${
                    index <= currentStep ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
          <CurrentStepComponent 
            onNext={handleStepComplete}
            onBack={handleBack}
            data={stepData[currentStep]}
          />
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
}