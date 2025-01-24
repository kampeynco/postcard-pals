import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface StepWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  isCompleted?: boolean;
}

export const StepWrapper = ({
  title,
  description,
  children,
  onNext,
  onBack,
  isSubmitting = false,
  isValid = false,
  isCompleted = false,
}: StepWrapperProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        {isCompleted && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {children}

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};