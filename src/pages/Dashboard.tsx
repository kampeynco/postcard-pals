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
import { useAuth } from "@/components/auth/Auth";

const Dashboard = () => {
  const { session } = useAuth();
  const { stats } = useDashboardStats();

  // Query to check user's profile and ActBlue account status
  const { data: accountStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["account-status", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Failed to load profile data");
        return null;
      }

      // Check ActBlue account
      const { data: actblueAccount, error: actblueError } = await supabase
        .from("actblue_accounts")
        .select("is_active")
        .eq("user_id", session.user.id)
        .single();

      if (actblueError && actblueError.code !== 'PGRST116') { // Ignore "no rows returned" error
        console.error("Error fetching ActBlue account:", actblueError);
        toast.error("Failed to load ActBlue account data");
        return null;
      }

      return {
        hasProfile: !!(profile?.first_name || profile?.last_name),
        isActBlueActive: !!actblueAccount?.is_active
      };
    },
    enabled: !!session?.user?.id
  });

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

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Show empty state if profile is incomplete or ActBlue account is not active
  if (!accountStatus?.hasProfile || !accountStatus?.isActBlueActive) {
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