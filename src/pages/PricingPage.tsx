import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import { pricingPlans } from "@/config/pricingPlans";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

const PricingPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleGetStarted = () => {
    if (session) {
      navigate("/dashboard");
      toast.success("Welcome back! You're already signed in.");
    } else {
      navigate("/signup");
      toast.success("Let's get started with your account setup!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <PricingHeader />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard 
                key={plan.name} 
                plan={plan} 
                onGetStarted={handleGetStarted}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;