import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  return (
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
      view="sign_in"
      localization={{
        variables: {
          sign_in: {
            button_label: "Sign in",
            loading_button_label: "Signing in...",
            email_label: "Email address",
            password_label: "Password",
          },
        },
      }}
    />
  );
};

export default AuthForm;