import MainLayout from "@/components/layout/MainLayout";
import { StatusDashboard } from "@/components/monitoring/StatusDashboard";
import { ErrorBoundary } from "@/components/monitoring/ErrorBoundary";

const MonitoringPage = () => {
  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">System Monitoring</h1>
          <StatusDashboard />
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
};

export default MonitoringPage;