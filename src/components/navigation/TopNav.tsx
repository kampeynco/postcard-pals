import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { UserProfileMenu } from "./UserProfileMenu";
import { LayoutDashboard, CreditCard, Settings, Mail, Activity } from "lucide-react";

export function TopNav() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link
            to={ROUTES.ACCOUNTS}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Accounts
          </Link>
          <Link
            to={ROUTES.POSTCARDS}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Postcards
          </Link>
          <Link
            to={ROUTES.MONITORING}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </Link>
          <Link
            to={ROUTES.SETTINGS.BASE}
            className="text-sm font-medium transition-colors hover:text-primary flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
}