import { useNavigate } from "react-router-dom";
import ActBlueAccountForm from "@/components/actblue/ActBlueAccountForm";
import { toast } from "sonner";

export default function CreateActBlueAccount() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("ActBlue account created successfully");
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New ActBlue Account</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <ActBlueAccountForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}