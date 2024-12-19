import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { AuthChangeEvent } from "@supabase/supabase-js";

const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === "SIGNED_UP") {
        toast.success("Please check your email to confirm your account.");
        navigate("/signin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNav />
      <div className="flex-grow flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">Get started with PostCard</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
            view="sign_up"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;