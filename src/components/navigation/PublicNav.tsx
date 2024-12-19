import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const PublicNav = () => {
  const location = useLocation();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-semibold text-lg">
              PostCard
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/pricing"
                className={`${
                  location.pathname === "/pricing"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                } transition-colors duration-200`}
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-white/80" asChild>
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button className="bg-white text-[#4B5EE4] hover:bg-white/90" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;