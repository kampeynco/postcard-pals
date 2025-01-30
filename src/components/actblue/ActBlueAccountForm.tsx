import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommitteeTypeField } from "./CommitteeTypeField";
import { CommitteeNameField } from "./CommitteeNameField";
import { CandidateFields } from "./CandidateFields";
import { AddressFields } from "./AddressFields";
import { DisclaimerField } from "./DisclaimerField";
import { useActBlueForm } from "./useActBlueForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useState } from "react";
import { FormValues } from "./types";

interface ActBlueAccountFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function ActBlueAccountForm({ onSuccess, onBack }: ActBlueAccountFormProps) {
  const { form, committeeType, onSubmit, isLoading } = useActBlueForm({
    onSuccess,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = committeeType === "candidate" ? 3 : 2;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <CommitteeTypeField form={form} />
            <CommitteeNameField form={form} />
            {committeeType === "candidate" && <CandidateFields />}
          </div>
        );
      case 2:
        return <AddressFields form={form} />;
      case 3:
        return <DisclaimerField form={form} />;
      default:
        return null;
    }
  };

  const getFieldsForStep = (step: number): Array<keyof FormValues> => {
    switch (step) {
      case 1:
        return committeeType === 'candidate' 
          ? ['committee_type', 'committee_name', 'candidate_name', 'office_sought']
          : ['committee_type', 'committee_name'];
      case 2:
        return ['street_address', 'city', 'state', 'zip_code'];
      case 3:
        return ['disclaimer_text'];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      if (currentStep === totalSteps) {
        await form.handleSubmit(onSubmit)();
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
          {renderStepContent()}
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