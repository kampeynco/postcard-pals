import { UserProfileMenu } from "./UserProfileMenu";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnboarding = location.pathname.includes("/onboarding");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  return (
    <div className="bg-[#4B5EE4] border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <span className="text-white font-semibold text-lg">Thanks From Us</span>
          <div className="flex items-center space-x-4">
            {!isOnboarding && (
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/dashboard" className="text-white hover:text-gray-200">Dashboard</a>
                <a href="/postcards" className="text-white hover:text-gray-200">Postcards</a>
                <a href="/settings" className="text-white hover:text-gray-200">Settings</a>
              </nav>
            )}
            {isOnboarding ? (
              <Button 
                variant="ghost" 
                className="text-white hover:text-gray-200"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <UserProfileMenu />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};