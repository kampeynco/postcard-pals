import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DonationActivity } from "@/types/donations";

interface RecentActivityProps {
  activities: DonationActivity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (donation: DonationActivity) => {
    if (donation.postcard_sent) {
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Sent</Badge>;
    }
    if (donation.processed) {
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>;
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Unknown time";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {activities?.map((donation) => (
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
  );
};