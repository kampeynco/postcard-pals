import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/Auth";

const PublicNav = () => {
  const { session } = useAuth();

  return (
    <nav className="bg-[#4B5EE4] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">
              Thanks From Us
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!session ? (
              <>
                {/* Center-aligned navigation links */}
                <div className="flex items-center space-x-8">
                  <a 
                    href="#features" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                  <Link 
                    to="/pricing" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </div>

                {/* Right-aligned auth links */}
                <div className="flex items-center space-x-4 ml-8">
                  <Link 
                    to="/signin" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button 
                    asChild
                    className="bg-white text-[#4B5EE4] hover:bg-white/90"
                  >
                    <Link to="/signup">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              /* Dashboard button for logged-in users */
              <Button 
                asChild
                className="bg-[#F97316] hover:bg-[#F97316]/90 text-white ml-auto"
              >
                <Link to="/dashboard">
                  Dashboard →
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;