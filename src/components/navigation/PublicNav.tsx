import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicNav = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`${isHomePage ? 'absolute w-full z-10' : 'bg-[#4B5EE4]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-semibold text-lg">
              Thanks From Us
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              {isHomePage && (
                <>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    How It Works
                  </button>
                </>
              )}
              <Link
                to="/pricing"
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-[#4B5EE4] hover:bg-white"
              asChild
            >
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button 
              className="bg-white text-[#4B5EE4] hover:bg-white/90"
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