import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface EmptyStateProps {
  onCreateAccount?: () => void;
}

export function EmptyState({ onCreateAccount }: EmptyStateProps) {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      navigate(ROUTES.ACCOUNTS.NEW);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/50">
      <div className="mb-4">
        <div className="p-3 bg-primary/10 rounded-full inline-block">
          <Plus className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">No ActBlue Account</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Get started by creating your ActBlue account to begin managing your campaign donations.
      </p>
      <Button onClick={handleCreateAccount}>
        <Plus className="h-4 w-4 mr-2" />
        Create ActBlue Account
      </Button>
    </div>
  );
}