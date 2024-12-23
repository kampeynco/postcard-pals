import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

interface IntegrateActBlueStepProps {
  onNext: () => void;
}

export const IntegrateActBlueStep = ({ onNext }: IntegrateActBlueStepProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from("actblue_accounts")
        .update({ 
          is_onboarded: true,
          is_active: true
        })
        .eq("user_id", session?.user.id);

      if (error) throw error;

      toast.success("Setup completed successfully!");
      onNext();
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error("Failed to complete setup");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Grant ActBlue Access</h2>
        <p className="text-gray-500 text-sm">Connect your ActBlue account to start processing donations</p>
      </div>

      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Instructional Video Placeholder</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Log into your ActBlue account</li>
          <li>Click on the People navigation link on left sidebar</li>
          <li>Click on the Invite Someone button</li>
          <li>Copy and paste email below into the email Input field on the right side of page</li>
          <li>Select the Integrations role</li>
          <li>Click the Grant Access button</li>
        </ol>
      </div>

      <Button onClick={handleComplete} className="w-full">
        Complete Setup
      </Button>
    </div>
  );
};