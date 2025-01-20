import { Badge } from "@/components/ui/badge";
import { DonationActivity } from "@/types/donations";

interface StatusBadgeProps {
  donation: DonationActivity;
}

export const StatusBadge = ({ donation }: StatusBadgeProps) => {
  if (donation.postcard_sent) {
    return <Badge className="bg-emerald-100 text-emerald-700">Sent</Badge>;
  }
  if (donation.processed) {
    return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>;
  }
  return <Badge variant="destructive" className="bg-red-100 text-red-700">Error</Badge>;
};