import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from 'react';
import { validateSignUpForm } from './validation';
import { toast } from 'sonner';
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const email = (event.target as any).email.value;
      const password = (event.target as any).password.value;
      const { isValid, errors } = validateSignUpForm(email, password);

      if (!isValid) {
        setErrorMessage(errors.join(' '));
        return;
      }

      // Submit logic here
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Signup failed. Please try again.');
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">Get started with Thanks From Us</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}
        {isSubmitting && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
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
                button_label: isSubmitting ? "Creating account..." : "Sign up",
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