import { UserProfileMenu } from "./UserProfileMenu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TopNavProps {
  hideNavigation?: boolean;
  showLogout?: boolean;
}

export const TopNav = ({ hideNavigation = false, showLogout = false }: TopNavProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="bg-brand-background border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <span className="text-white font-semibold text-lg">Thanks From Us</span>
          <div className="flex items-center space-x-4">
            {!hideNavigation && (
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/dashboard" className="text-white hover:text-gray-200">Dashboard</a>
                <a href="/postcards" className="text-white hover:text-gray-200">Postcards</a>
                <a href="/settings" className="text-white hover:text-gray-200">Settings</a>
              </nav>
            )}
            {showLogout ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
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