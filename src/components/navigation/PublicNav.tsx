import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicNav = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className={`${isHomePage ? 'absolute w-full z-10' : 'bg-white border-b'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className={`${isHomePage ? 'text-white' : 'text-[#9b87f5]'} font-semibold text-lg`}>
              Thanks From Us
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/pricing"
                className={`${
                  isHomePage
                    ? "text-white/80 hover:text-white"
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
              className={`${
                isHomePage
                  ? "text-white hover:text-white/80"
                  : "text-[#7E69AB] hover:text-[#6E59A5] hover:bg-[#D6BCFA]/10"
              }`}
              asChild
            >
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button 
              className={`${
                isHomePage
                  ? "bg-white text-[#4B5EE4] hover:bg-white/90"
                  : "bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
              }`}
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