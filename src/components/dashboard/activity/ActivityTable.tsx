import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonationActivity } from "@/types/donations";
import { StatusBadge } from "./StatusBadge";

interface ActivityTableProps {
  activities: DonationActivity[];
}

export const ActivityTable = ({ activities }: ActivityTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <span>{donation.donation_data.donor_name}</span>
              </div>
            </TableCell>
            <TableCell>${donation.donation_data.amount.toFixed(2)}</TableCell>
            <TableCell>{formatDate(donation.created_at)}</TableCell>
            <TableCell>
              <StatusBadge donation={donation} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};