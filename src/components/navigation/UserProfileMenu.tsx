import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export const UserProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error && error.message !== "session_not_found") {
        console.error("Error logging out:", error);
        toast.error("Failed to log out");
        return;
      }

      navigate(ROUTES.SIGNIN);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-emerald-50">
          <span className="h-5 w-5 text-emerald-600">U</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS.BASE)}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};