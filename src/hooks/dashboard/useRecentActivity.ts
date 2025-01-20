import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationActivity } from "@/types/donations";
import { toast } from "sonner";

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        return (data as DonationActivity[]) || [];
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast.error("Failed to load recent activity");
        return [];
      }
    },
  });
};