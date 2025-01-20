import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRecentActivity } from "@/hooks/dashboard/useRecentActivity";
import { ActivityTable } from "./activity/ActivityTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const RecentActivity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: activities = [] } = useRecentActivity();

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

        <ActivityTable activities={paginatedActivities} />

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