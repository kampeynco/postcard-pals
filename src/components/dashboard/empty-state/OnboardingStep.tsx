import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface OnboardingStepProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  formStep: number;
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export const OnboardingStep = ({ 
  id, 
  title, 
  description, 
  completed,
  formStep,
  onClick,
  disabled = false
}: OnboardingStepProps) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAction = async () => {
    if (disabled || isNavigating) return;
    
    try {
      setIsNavigating(true);
      await onClick();
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error("Failed to navigate to step. Please try again.");
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <div
      className={`flex items-center p-4 bg-white rounded-lg border transition-colors ${
        disabled 
          ? 'border-gray-100 opacity-60 cursor-not-allowed' 
          : 'border-gray-200 hover:border-brand-background cursor-pointer'
      }`}
      onClick={handleAction}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction();
        }
      }}
      aria-label={`Onboarding step ${id}: ${title}`}
      aria-disabled={disabled}
    >
      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-brand-background text-white">
        {completed ? (
          <Check className="h-4 w-4" />
        ) : (
          <span className="text-sm">{id}</span>
        )}
      </div>

      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <Button
        variant="ghost"
        className="flex items-center text-brand-background hover:text-brand-background/80"
        onClick={(e) => {
          e.stopPropagation();
          handleAction();
        }}
        disabled={disabled || isNavigating}
        aria-label={`Start ${title} step`}
      >
        {isNavigating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};