import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
        <div className="space-y-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate("/templates/new")}
          >
            Create New Template
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/donations")}
          >
            View Recent Donations
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/settings")}
          >
            Configure Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};