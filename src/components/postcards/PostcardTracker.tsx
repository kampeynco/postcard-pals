import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import ErrorMessage from "@/components/ui/ErrorMessage"; // Correct import for ErrorMessage

// Adding type definitions for postcards
interface Postcard {
  id: string;
  donation_id: string;
  created_at: string;
  tracking_number?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned'; 
  expected_delivery_date?: string;
}

export const PostcardTracker = () => {
  const { data: postcards, isLoading, isError }: UseQueryResult<Postcard[]> = useQuery<Postcard[]>({
    queryKey: ['postcards'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication required");
        throw new Error("No authenticated session");
      }

      const { data, error } = await supabase
        .from('postcards')
        .select('*, donations(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching postcards:', error);
        toast.error(`Failed to load postcards: ${error.message}`);
        throw error;
      }
      return data as Postcard[]; 
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_transit: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      returned: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) return <LoadingSpinner />; 
  if (isError) return <ErrorMessage message="Error loading postcards." />; 

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Postcard Tracking</h2>
      <div className="space-y-4">
        {postcards?.map((postcard) => (
          <div key={postcard.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Donation ID: {postcard.donation_id}</p>
              <p className="text-sm text-gray-500">Sent: {new Date(postcard.created_at).toLocaleDateString()}</p>
              {postcard.tracking_number && (
                <p className="text-sm text-gray-500">Tracking: {postcard.tracking_number}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge(postcard.status)}
              {postcard.expected_delivery_date && (
                <span className="text-sm text-gray-500">Expected: {new Date(postcard.expected_delivery_date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};