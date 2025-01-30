import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Row"];

interface ActBlueAccountCardProps {
  account: ActBlueAccount;
}

export function ActBlueAccountCard({ account }: ActBlueAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{account.committee_name}</CardTitle>
          <Badge variant={account.is_active ? "default" : "secondary"}>
            {account.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>
          {account.committee_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {account.candidate_name && (
            <div>
              <span className="text-muted-foreground">Candidate: </span>
              {account.candidate_name}
            </div>
          )}
          {account.office_sought && (
            <div>
              <span className="text-muted-foreground">Office: </span>
              {account.office_sought}
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Address: </span>
            <div className="mt-1">
              {account.street_address}
              <br />
              {account.city}, {account.state} {account.zip_code}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}