import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const SignUpForm = () => {
  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">Get started with Thanks From Us</p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          className: {
            button: 'disabled:opacity-50 disabled:cursor-not-allowed',
            container: 'space-y-4',
            message: 'text-sm text-red-600',
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
    </>
  );
};

export default SignUpForm;