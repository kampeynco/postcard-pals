import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface StepWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  isCompleted?: boolean;
  showCompletionIcon?: boolean;
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
  showCompletionIcon = true,
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
        {showCompletionIcon && isCompleted && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500">
            <Check className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {children}

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={isSubmitting || !isValid}
          className="min-w-[100px]"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : isCompleted ? (
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Done
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};