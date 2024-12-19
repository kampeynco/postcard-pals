const ConfirmationMessage = () => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
      <p className="text-gray-600">
        We've sent you a confirmation email. Please check your inbox and follow the instructions to confirm your account.
      </p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Redirecting you to sign in page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default ConfirmationMessage;