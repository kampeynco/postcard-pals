import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DonationActivity, Stats } from "@/types/donations";

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    activeTemplates: 0,
    failedPostcards: 0,
    lastMonthDonations: 0,
    lastMonthTemplates: 0,
    lastMonthFailures: 0,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      
      return (data as DonationActivity[]) || [];
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const [donationsResult, templatesResult, postcardsResult] = await Promise.all([
        supabase.from("donations").select("created_at"),
        supabase.from("templates").select("*").eq("is_active", true),
        supabase.from("postcards").select("*"),
      ]);

      const currentDonations = donationsResult.data?.length || 0;
      const lastMonthDonations = donationsResult.data?.filter(
        d => d.created_at && new Date(d.created_at) >= lastMonth
      ).length || 0;

      const activeTemplates = templatesResult.data?.length || 0;
      const lastMonthTemplates = templatesResult.data?.filter(
        t => t.created_at && new Date(t.created_at) >= lastMonth
      ).length || 0;

      const failedCount = postcardsResult.data?.filter(p => p.status === "failed").length || 0;
      const lastMonthFailures = postcardsResult.data?.filter(
        p => p.created_at && p.status === "failed" && new Date(p.created_at) >= lastMonth
      ).length || 0;

      setStats({
        totalDonations: currentDonations,
        activeTemplates,
        failedPostcards: failedCount,
        lastMonthDonations,
        lastMonthTemplates,
        lastMonthFailures,
      });
    };

    fetchStats();

    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations" },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "postcards" },
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "templates" },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <DashboardHeader />
      <DashboardStats stats={stats} />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity activities={recentActivity || []} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;