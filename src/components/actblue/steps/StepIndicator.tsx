import { FormStep } from "../types/steps";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: FormStep[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.id === currentStep
                ? "bg-primary text-white"
                : step.id < currentStep
                ? "bg-primary/20 text-primary"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step.id < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span>{step.id}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step.id < currentStep ? "bg-primary/20" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};