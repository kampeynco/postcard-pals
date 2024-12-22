import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface IntegrateActBlueStepProps {
  onNext: () => void;
}

export const IntegrateActBlueStep = ({ onNext }: IntegrateActBlueStepProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleComplete = async () => {
    try {
      // Update ActBlue account to mark onboarding as complete
      const { error } = await supabase
        .from("actblue_accounts")
        .update({ is_onboarded: true })
        .eq("user_id", session?.user.id);

      if (error) throw error;

      toast.success("Setup completed successfully!");
      onNext();
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to complete setup");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Integrate with ActBlue</h2>
        <p className="text-gray-500 text-sm">Connect your ActBlue account to start processing donations</p>
      </div>

      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Instructional Video Placeholder</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Log in to your ActBlue account</li>
          <li>Navigate to Account Settings</li>
          <li>Select "API & Webhooks"</li>
          <li>Add the Thanks From Us webhook URL</li>
          <li>Save your changes</li>
        </ol>
      </div>

      <Button onClick={handleComplete} className="w-full">
        Complete Setup
      </Button>
    </div>
  );
};