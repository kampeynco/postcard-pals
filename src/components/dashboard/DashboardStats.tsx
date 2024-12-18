import { Card } from "@/components/ui/card";
import { Mail, Users, AlertTriangle } from "lucide-react";

interface StatsProps {
  stats: {
    totalDonations: number;
    activeTemplates: number;
    failedPostcards: number;
  };
}

export const DashboardStats = ({ stats }: StatsProps) => {
  return (
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
  );
};