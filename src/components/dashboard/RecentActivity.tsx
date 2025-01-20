import { DonationActivity } from "@/types/donations";
import { ActivityTable } from "./activity/ActivityTable";

interface RecentActivityProps {
  activities: DonationActivity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <ActivityTable activities={activities} />
    </div>
  );
};