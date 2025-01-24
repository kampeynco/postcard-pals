import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { StepWrapper } from "./steps/StepWrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface IntegrateActBlueStepProps {
  onNext: () => void;
}

export function IntegrateActBlueStep({ onNext }: IntegrateActBlueStepProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async () => {
    setIsCompleted(true);
    await onNext();
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <StepWrapper
      title="Connect Your ActBlue Account"
      description="Enter your ActBlue committee details to start processing donations"
      onNext={handleSuccess}
      onBack={handleBack}
      isValid={true}
      isCompleted={isCompleted}
    >
      <ActBlueAccountForm onSuccess={handleSuccess} />
    </StepWrapper>
  );
}