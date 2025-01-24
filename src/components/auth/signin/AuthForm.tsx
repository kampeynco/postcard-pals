import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import type { Provider } from "@supabase/supabase-js";
import { useState } from 'react';
import { toast } from "sonner";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        toast.error('Please enter both email and password');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        console.log('Successfully signed in:', data.user.email);
        toast.success('Successfully signed in!');
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
        providers={[] as Provider[]}
        redirectTo={`${window.location.origin}/auth/callback`}
        view="sign_in"
        showLinks={true}
        localization={{
          variables: {
            sign_in: {
              button_label: isLoading ? "Signing in..." : "Sign in",
              loading_button_label: "Signing in...",
              email_label: "Email address",
              password_label: "Password",
              email_input_placeholder: "Enter your email",
              password_input_placeholder: "Enter your password",
            },
            forgotten_password: {
              button_label: "Reset password",
              loading_button_label: "Sending reset instructions...",
              email_label: "Email address",
              email_input_placeholder: "Enter your email",
            },
          },
        }}
      />
    </div>
  );
};

export default AuthForm;