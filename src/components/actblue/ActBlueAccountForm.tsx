import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useActBlueForm } from "./hooks/useActBlueForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useState } from "react";
import { FormValues } from "./types";
import { CommitteeStep } from "./steps/CommitteeStep";
import { AddressStep } from "./steps/AddressStep";
import { DisclaimerStep } from "./steps/DisclaimerStep";

interface ActBlueAccountFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function ActBlueAccountForm({ onSuccess, onBack }: ActBlueAccountFormProps) {
  const { form, committeeType, onSubmit, isLoading } = useActBlueForm({ onSuccess });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = committeeType === "candidate" ? 3 : 2;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getFieldsForStep = (step: number) => {
    const baseFields = ["committee_type", "legal_committee_name", "organization_name"] as const;
    const candidateFields = [
      "candidate_first_name",
      "candidate_middle_name",
      "candidate_last_name",
      "candidate_suffix",
      "office_sought"
    ] as const;
    const addressFields = ["street_address", "city", "state", "zip_code"] as const;
    const disclaimerFields = ["disclaimer_text"] as const;

    switch (step) {
      case 1:
        return committeeType === 'candidate' 
          ? [...baseFields, ...candidateFields]
          : baseFields;
      case 2:
        return addressFields;
      case 3:
        return disclaimerFields;
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      if (currentStep === totalSteps) {
        await onSubmit(form.getValues());
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack?.();
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="space-y-6">
          {currentStep === 1 && <CommitteeStep form={form} committeeType={committeeType} />}
          {currentStep === 2 && <AddressStep form={form} />}
          {currentStep === 3 && <DisclaimerStep form={form} />}
        </div>
        
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={form.formState.isSubmitting}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : currentStep === totalSteps ? (
              'Save ActBlue Settings'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}