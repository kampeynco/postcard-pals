import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";

export const UserProfileMenu = () => {
  const navigate = useNavigate();

  const { data: actblueAccounts } = useQuery({
    queryKey: ["actblue-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actblue_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Even if we get a session_not_found error, we still want to clear local state
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex justify-between items-center">
            <span>Accounts</span>
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {actblueAccounts?.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => navigate(`/settings/actblue/${account.id}`)}
              >
                {account.committee_name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings/actblue/new")}>
              Create New Account
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings/account")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};