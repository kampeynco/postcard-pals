import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DonationActivity } from "@/types/donations";
import { toast } from "sonner";
import { useOnboardingStatus } from "@/hooks/dashboard/useOnboardingStatus";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const Dashboard = () => {
  const { isOnboarded, loading: isLoadingOnboarding } = useOnboardingStatus();
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
    enabled: isOnboarded, // Only fetch if onboarding is complete
  });

  if (isLoadingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isOnboarded) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <DashboardStats stats={stats} />
      <DashboardCharts />
      {isLoadingActivity ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <RecentActivity activities={recentActivity || []} />
      )}
    </div>
  );
};

export default Dashboard;