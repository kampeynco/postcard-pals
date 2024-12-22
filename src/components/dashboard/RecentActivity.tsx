import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DonationActivity } from "@/types/donations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RecentActivityProps {
  activities: DonationActivity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (donation: DonationActivity) => {
    if (donation.postcard_sent) {
      return <Badge className="bg-emerald-100 text-emerald-700">Sent</Badge>;
    }
    if (donation.processed) {
      return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-100 text-red-700">Error</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredActivities = activities.filter((activity) =>
    activity.donation_data.donor_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Search donations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[300px]"
            />
            <Button variant="outline">Export</Button>
          </div>
        </div>

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
            {paginatedActivities.map((donation) => (
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
                <TableCell>{getStatusBadge(donation)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage === 1 ? (
                  <PaginationPrevious className="pointer-events-none opacity-50" />
                ) : (
                  <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
                )}
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage === totalPages ? (
                  <PaginationNext className="pointer-events-none opacity-50" />
                ) : (
                  <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
};