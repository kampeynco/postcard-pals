import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <PublicNav />
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Thank Your Donors with
            <span className="text-emerald-600"> Personalized Postcards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Automatically send beautiful, personalized thank you postcards to your donors.
            Strengthen relationships and increase donor retention.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Automated Sending</h3>
              <p className="text-gray-600">
                Connect your ActBlue account and automatically send postcards when you receive donations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Beautiful Templates</h3>
              <p className="text-gray-600">
                Choose from our collection of professionally designed templates or create your own.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3">Track Everything</h3>
              <p className="text-gray-600">
                Monitor delivery status and get insights into your donor thank you program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
