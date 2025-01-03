import { TopNav } from "@/components/navigation/TopNav";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className="min-h-screen">
      <div className="bg-brand-background">
        <TopNav hideNavigation={isOnboarding} showLogout={isOnboarding} />
      </div>
      <main className="bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;