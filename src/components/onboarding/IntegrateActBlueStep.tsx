import { Button } from "@/components/ui/button";
import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface IntegrateActBlueStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function IntegrateActBlueStep({ onNext, onBack }: IntegrateActBlueStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Connect Your ActBlue Account</h2>
        <p className="text-sm text-gray-600">
          Enter your ActBlue committee details to start processing donations
        </p>
      </div>

      <ActBlueAccountForm onSuccess={onNext} />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}