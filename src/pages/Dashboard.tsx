import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DonationActivity } from "@/types/donations";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/auth/Auth";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";

const Dashboard = () => {
  const { session } = useAuth();

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        return (data as DonationActivity[]) || [];
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast.error("Failed to load recent activity");
        return [];
      }
    },
  });

  if (isLoadingActivity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recentActivity || recentActivity.length === 0) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <Card className="mt-8 p-12 flex flex-col items-center justify-center text-center">
          <Database className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
          <p className="text-gray-600 mb-4">
            When you receive donations, they will appear here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <RecentActivity activities={recentActivity} />
    </div>
  );
};

export default Dashboard;