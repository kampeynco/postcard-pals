import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const PublicNav = () => {
  const location = useLocation();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-[#9b87f5] font-semibold text-lg">
              PostCard
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <span className="text-[#8E9196] text-sm">Powered by ActBlue</span>
              <Link
                to="/pricing"
                className={`${
                  location.pathname === "/pricing"
                    ? "text-[#7E69AB]"
                    : "text-[#8E9196] hover:text-[#7E69AB]"
                } transition-colors duration-200`}
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-[#7E69AB] hover:text-[#6E59A5] hover:bg-[#D6BCFA]/10" 
              asChild
            >
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button 
              className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]" 
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;