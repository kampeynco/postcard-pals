import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stats } from "@/types/donations";
import { toast } from "sonner";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    activeTemplates: 0,
    failedPostcards: 0,
    lastMonthDonations: 0,
    lastMonthTemplates: 0,
    lastMonthFailures: 0,
  });

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const fetchStats = async () => {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const [donationsResult, templatesResult, postcardsResult] = await Promise.all([
        supabase.from("donations").select("created_at"),
        supabase.from("templates").select("*").eq("is_active", true),
        supabase.from("postcards").select("*"),
      ]);

      if (donationsResult.error) throw donationsResult.error;
      if (templatesResult.error) throw templatesResult.error;
      if (postcardsResult.error) throw postcardsResult.error;

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
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  useEffect(() => {
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

  return { stats, calculatePercentageChange };
};