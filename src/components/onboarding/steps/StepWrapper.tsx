import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StepWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const StepWrapper = ({
  title,
  description,
  children,
  onNext,
  onBack,
  isSubmitting = false,
}: StepWrapperProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {children}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};