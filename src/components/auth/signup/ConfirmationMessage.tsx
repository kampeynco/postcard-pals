import { useNavigate } from "react-router-dom";

const ConfirmationMessage = () => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
      <p className="text-gray-600">
        We've sent you a confirmation email. Please check your inbox and follow the instructions to confirm your account.
      </p>
      <p className="text-sm text-gray-500">
        Redirecting you to sign in page in a few seconds...
      </p>
    </div>
  );
};

export default ConfirmationMessage;