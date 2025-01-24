import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

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
  const handleNext = () => {
    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    onNext();
  };

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
          <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
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
          onClick={handleNext} 
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};