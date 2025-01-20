import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from 'react';

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isValid = validateSignUpForm(); // Assume this function validates the form
    if (!isValid) {
      setErrorMessage('Please fix the errors in the form.');
      return;
    }
    try {
      // Submit logic here
    } catch (error) {
      setErrorMessage('Submission failed. Please try again.');
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">Get started with Thanks From Us</p>
      </div>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            className: {
              button: 'w-full disabled:opacity-50 disabled:cursor-not-allowed',
              container: 'space-y-4',
              message: 'text-sm text-red-600',
              input: 'w-full',
              label: 'block text-sm font-medium text-gray-700',
            },
          }}
          theme="light"
          providers={[]}
          view="sign_up"
          localization={{
            variables: {
              sign_up: {
                button_label: "Sign up",
                loading_button_label: "Signing up...",
                email_label: "Email address",
                password_label: "Create a password",
              },
            },
          }}
        />
      </form>
    </>
  );
};

export default SignUpForm;