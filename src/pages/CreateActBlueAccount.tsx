import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { EmptyState } from "@/components/accounts/EmptyState";
import { toast } from "sonner";

export default function CreateActBlueAccount() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    toast.success("ActBlue account created successfully");
    navigate("/dashboard");
  };

  const handleCreateAccount = () => {
    setShowForm(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ActBlue Account Setup</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {showForm ? (
            <ActBlueAccountForm onSuccess={handleSuccess} />
          ) : (
            <EmptyState onCreateAccount={handleCreateAccount} />
          )}
        </div>
      </div>
    </div>
  );
}