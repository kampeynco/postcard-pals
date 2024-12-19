import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const QuickActions = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    navigate(path);
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
        <div className="space-y-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
            onClick={() => handleNavigation("/templates/new")}
            disabled={isNavigating}
          >
            Create New Template
          </Button>
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation("/donations")}
            disabled={isNavigating}
          >
            View Recent Donations
          </Button>
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation("/settings")}
            disabled={isNavigating}
          >
            Configure Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};