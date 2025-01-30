import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ActBlueAccountCard } from "@/components/accounts/ActBlueAccountCard";
import { EmptyState } from "@/components/accounts/EmptyState";
import { ROUTES } from "@/constants/routes";

export default function AccountsPage() {
  const navigate = useNavigate();
  
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["actblue-accounts"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error("No authenticated user");
      
      const { data, error } = await supabase
        .from("actblue_accounts")
        .select("*")
        .eq("user_id", session.session.user.id);
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  const handleCreateAccount = () => {
    navigate(ROUTES.SETTINGS.ACTBLUE_NEW);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">ActBlue Accounts</h1>
        <Button onClick={handleCreateAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Create ActBlue Account
        </Button>
      </div>

      {!accounts?.length ? (
        <EmptyState onCreateAccount={handleCreateAccount} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <ActBlueAccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}