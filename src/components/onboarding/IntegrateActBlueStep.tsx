import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";

interface IntegrateActBlueStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function IntegrateActBlueStep({ onNext, onBack }: IntegrateActBlueStepProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSuccess = async () => {
    setIsCompleted(true);
    await onNext();
  };

  return (
    <StepWrapper
      title="Connect Your ActBlue Account"
      description="Enter your ActBlue committee details to start processing donations"
      onNext={handleSuccess}
      onBack={onBack}
      isValid={true}
      isCompleted={isCompleted}
    >
      <ActBlueAccountForm onSuccess={handleSuccess} />
    </StepWrapper>
  );
}