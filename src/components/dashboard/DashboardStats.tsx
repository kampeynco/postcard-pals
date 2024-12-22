import { Card } from "@/components/ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";

interface StatsProps {
  stats: {
    totalDonations: number;
    activeTemplates: number;
    failedPostcards: number;
    lastMonthDonations: number;
    lastMonthTemplates: number;
    lastMonthFailures: number;
  };
}

export const DashboardStats = ({ stats }: StatsProps) => {
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const donationChange = calculatePercentageChange(
    stats.totalDonations,
    stats.lastMonthDonations
  );

  const templateChange = calculatePercentageChange(
    stats.activeTemplates,
    stats.lastMonthTemplates
  );

  const failureChange = calculatePercentageChange(
    stats.failedPostcards,
    stats.lastMonthFailures
  );

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="p-6 bg-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4" />
            <span>All Donations</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{stats.totalDonations}</span>
            <span className={`text-sm ${donationChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {donationChange >= 0 ? '↑' : '↓'} {Math.abs(donationChange)}% vs last month
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Clock className="h-4 w-4" />
            <span>Active Templates</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{stats.activeTemplates}</span>
            <span className={`text-sm ${templateChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {templateChange >= 0 ? '↑' : '↓'} {Math.abs(templateChange)}% vs last month
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <CheckCircle className="h-4 w-4" />
            <span>Failed Postcards</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{stats.failedPostcards}</span>
            <span className={`text-sm ${failureChange <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {failureChange <= 0 ? '↓' : '↑'} {Math.abs(failureChange)}% vs last month
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};