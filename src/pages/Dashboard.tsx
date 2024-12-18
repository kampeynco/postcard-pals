import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Users, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalDonations: number;
  activeTemplates: number;
  failedPostcards: number;
  lastMonthDonations: number;
  lastMonthTemplates: number;
  lastMonthFailures: number;
}

interface DonationActivity {
  id: string;
  created_at: string;
  donation_data: {
    amount: number;
    donor_name: string;
  };
  processed: boolean;
  postcard_sent: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
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
      return data as DonationActivity[];
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const [donationsResult, templatesResult, postcardsResult] = await Promise.all([
        supabase.from("donations").select("created_at"),
        supabase.from("templates").select("*").eq("is_active", true),
        supabase.from("postcards").select("status"),
      ]);

      const currentDonations = donationsResult.data?.length || 0;
      const lastMonthDonations = donationsResult.data?.filter(
        d => new Date(d.created_at) >= lastMonth
      ).length || 0;

      const activeTemplates = templatesResult.data?.length || 0;
      const lastMonthTemplates = templatesResult.data?.filter(
        t => new Date(t.created_at) >= lastMonth
      ).length || 0;

      const failedCount = postcardsResult.data?.filter(p => p.status === "failed").length || 0;
      const lastMonthFailures = postcardsResult.data?.filter(
        p => p.status === "failed" && new Date(p.created_at) >= lastMonth
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

  const getStatusBadge = (donation: DonationActivity) => {
    if (donation.postcard_sent) {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Sent</Badge>;
    }
    if (donation.processed) {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Total Donations</p>
              <h3 className="text-2xl font-bold mb-2">{stats.totalDonations}</h3>
              <p className="text-emerald-600 text-sm">
                ↑ 12% vs last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Active Templates</p>
              <h3 className="text-2xl font-bold mb-2">{stats.activeTemplates}</h3>
              <p className="text-emerald-600 text-sm">
                ↑ 2 vs last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 mb-1">Failed Postcards</p>
              <h3 className="text-2xl font-bold mb-2">{stats.failedPostcards}</h3>
              <p className="text-red-600 text-sm">
                ↓ 5% vs last month
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {recentActivity?.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {donation.donation_data.donor_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${donation.donation_data.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(donation)}
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(donation.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="mt-4 text-emerald-600 hover:text-emerald-700 p-0"
                onClick={() => navigate("/activity")}
              >
                View all activity →
              </Button>
            </div>
          </Card>
        </div>

        <div>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;