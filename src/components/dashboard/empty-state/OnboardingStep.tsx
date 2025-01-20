import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStepProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  onClick: () => void;
}

export const OnboardingStep = ({ 
  id, 
  title, 
  description, 
  completed, 
  onClick 
}: OnboardingStepProps) => {
  return (
    <div
      className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-background transition-colors cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
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
          onClick();
        }}
        aria-label={`Get started with ${title}`}
      >
        Get Started
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};