import { UserProfileMenu } from "./UserProfileMenu";
import { Link } from "react-router-dom";

export const TopNav = () => {
  return (
    <div className="bg-[#4B5EE4] border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <span className="text-white font-semibold text-lg">Thanks From Us</span>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
              <Link to="/postcards" className="text-white hover:text-gray-200">Postcards</Link>
              <Link to="/settings" className="text-white hover:text-gray-200">Settings</Link>
            </nav>
            <UserProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};