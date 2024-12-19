import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Clock, Send } from "lucide-react";

export const StatusDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['monitoring-stats'],
    queryFn: async () => {
      const [postcards, webhooks] = await Promise.all([
        supabase.from('postcards').select('status'),
        supabase.from('webhook_logs').select('status,error_message').order('created_at', { ascending: false }).limit(10)
      ]);

      if (postcards.error) throw postcards.error;
      if (webhooks.error) throw webhooks.error;

      const postcardStats = postcards.data.reduce((acc: any, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      return {
        postcardStats,
        recentWebhooks: webhooks.data
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleRetryFailed = async () => {
    try {
      const { data: failedPostcards, error } = await supabase
        .from('postcards')
        .select('*')
        .eq('status', 'failed');

      if (error) throw error;

      // Trigger retry for each failed postcard
      await Promise.all(failedPostcards.map(async (postcard) => {
        const { error: retryError } = await supabase.functions.invoke('retry-postcard', {
          body: { postcardId: postcard.id }
        });
        
        if (retryError) throw retryError;
      }));

      toast.success('Retry initiated for failed postcards');
    } catch (error) {
      console.error('Error retrying failed postcards:', error);
      toast.error('Failed to retry postcards');
    }
  };

  if (isLoading) {
    return <div>Loading monitoring data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Send className="h-5 w-5" />}
            label="Pending"
            count={stats?.postcardStats?.pending || 0}
            variant="warning"
          />
          <StatusCard
            icon={<Clock className="h-5 w-5" />}
            label="In Transit"
            count={stats?.postcardStats?.in_transit || 0}
            variant="info"
          />
          <StatusCard
            icon={<CheckCircle className="h-5 w-5" />}
            label="Delivered"
            count={stats?.postcardStats?.delivered || 0}
            variant="success"
          />
          <StatusCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Failed"
            count={stats?.postcardStats?.failed || 0}
            variant="error"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Issues</h2>
          <Button 
            onClick={handleRetryFailed}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Retry Failed Postcards
          </Button>
        </div>
        <div className="space-y-4">
          {stats?.recentWebhooks.map((log: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Badge
                  variant={log.status === 'error' ? 'destructive' : 'default'}
                >
                  {log.status}
                </Badge>
                {log.error_message && (
                  <p className="text-sm text-gray-600 mt-1">{log.error_message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const StatusCard = ({ 
  icon, 
  label, 
  count, 
  variant 
}: { 
  icon: React.ReactNode; 
  label: string; 
  count: number; 
  variant: 'success' | 'warning' | 'error' | 'info' 
}) => {
  const variantStyles = {
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700'
  };

  return (
    <div className={`p-4 rounded-lg ${variantStyles[variant]}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
};