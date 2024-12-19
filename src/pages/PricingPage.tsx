import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import { pricingPlans } from "@/config/pricingPlans";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
    toast.success("Let's get started with your account setup!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <PricingHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              onGetStarted={handleGetStarted}
            />
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PricingPage;