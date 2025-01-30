import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { EmptyState } from "@/components/accounts/EmptyState";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { StepIndicator } from "@/components/actblue/steps/StepIndicator";
import { FORM_STEPS } from "@/components/actblue/types/steps";

export default function CreateActBlueAccount() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    toast.success("ActBlue account created successfully");
    navigate(ROUTES.ACCOUNTS.BASE);
  };

  const handleCreateAccount = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      navigate(ROUTES.ACCOUNTS.BASE);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ActBlue Account Setup</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          {showForm ? (
            <>
              <StepIndicator currentStep={1} steps={FORM_STEPS} />
              <ActBlueAccountForm 
                onSuccess={handleSuccess} 
                onBack={handleBack}
              />
            </>
          ) : (
            <EmptyState onCreateAccount={handleCreateAccount} />
          )}
        </div>
      </div>
    </div>
  );
}