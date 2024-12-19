import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserProfileMenu from "./UserProfileMenu";

const TopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="border-b">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-emerald-600 font-semibold text-lg">
            PostCard
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`${
                isActive("/dashboard")
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-500"
              } pb-4 pt-4`}
            >
              Dashboard
            </Link>
            <Link
              to="/templates"
              className={`${
                isActive("/templates")
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-500"
              } pb-4 pt-4`}
            >
              Templates
            </Link>
            <Link
              to="/donations"
              className={`${
                isActive("/donations")
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-500"
              } pb-4 pt-4`}
            >
              Donations
            </Link>
            <Link
              to="/settings/actblue"
              className={`${
                isActive("/settings/actblue")
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-500"
              } pb-4 pt-4`}
            >
              ActBlue Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;