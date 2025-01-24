import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { StepWrapper } from "./steps/StepWrapper";

interface IntegrateActBlueStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function IntegrateActBlueStep({ onNext, onBack }: IntegrateActBlueStepProps) {
  return (
    <StepWrapper
      title="Connect Your ActBlue Account"
      description="Enter your ActBlue committee details to start processing donations"
      onNext={onNext}
      onBack={onBack}
    >
      <ActBlueAccountForm onSuccess={onNext} />
    </StepWrapper>
  );
}