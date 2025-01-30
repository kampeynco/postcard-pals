import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DonationActivity } from "@/types/donations";
import { toast } from "sonner";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/components/auth/Auth";

const Dashboard = () => {
  const { session } = useAuth();
  const { stats } = useDashboardStats();

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

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

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <DashboardStats stats={stats} />
      <DashboardCharts />
      <RecentActivity activities={recentActivity || []} />
    </div>
  );
};

export default Dashboard;