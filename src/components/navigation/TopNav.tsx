import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { UserProfileMenu } from "./UserProfileMenu";

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
                className="text-sm font-medium text-white transition-colors hover:text-primary"
              >
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