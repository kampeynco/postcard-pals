import { StepWrapper } from "./steps/StepWrapper";
import { AddressVerification } from "@/components/address/AddressVerification";
import { AddressInput } from "@/components/address/types";
import { useState } from "react";

interface VerifyAddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function VerifyAddressStep({ onNext, onBack }: VerifyAddressStepProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVerified = async (address: AddressInput) => {
    setIsCompleted(true);
    await onNext();
  };

  return (
    <StepWrapper
      title="Campaign Office Address"
      description="Enter and verify your campaign office address"
      onNext={onNext}
      onBack={onBack}
      isValid={isCompleted}
      isCompleted={isCompleted}
    >
      <div className="space-y-6">
        <AddressVerification onVerified={handleVerified} />
      </div>
    </StepWrapper>
  );
}