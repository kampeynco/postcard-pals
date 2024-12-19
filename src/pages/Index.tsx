import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // If user is not authenticated, redirect to landing page
    if (!session?.user) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Signed in as: <span className="font-medium">{session.user.email}</span>
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/settings/actblue")}
                >
                  ActBlue Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;