import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const PublicNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-emerald-600 font-semibold text-lg">
              PostCard
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/pricing"
                className={`${
                  location.pathname === "/pricing"
                    ? "text-emerald-600"
                    : "text-gray-500 hover:text-gray-900"
                } transition-colors duration-200`}
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="https://preview--postcard-pals.lovable.app/login#auth-sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="https://preview--postcard-pals.lovable.app/login#auth-sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;