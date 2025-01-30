import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { UserProfileMenu } from "./UserProfileMenu";
import { Settings } from "lucide-react";

export function TopNav() {
  const location = useLocation();
  const isAccountsPage = location.pathname === ROUTES.ACCOUNTS;

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {!isAccountsPage && (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className="text-sm font-medium text-white transition-colors hover:text-primary"
              >
                Donations
              </Link>
              <Link
                to={ROUTES.SETTINGS.BASE}
                className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </>
          )}
          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
}