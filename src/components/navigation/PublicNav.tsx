import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/Auth";

const PublicNav = () => {
  const { session } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-900">Thanks From Us</Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            {session ? (
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" className="text-gray-600 hover:text-gray-900">Sign In</Link>
                <Link to="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Button variant="outline" className="text-gray-600 hover:text-gray-900">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;
