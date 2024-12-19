import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome, User 👋</h1>
        <p className="text-gray-500">Here's what's happening with your postcards</p>
      </div>
      <Button 
        onClick={() => navigate("/templates/new")}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Create Template
      </Button>
    </div>
  );
};