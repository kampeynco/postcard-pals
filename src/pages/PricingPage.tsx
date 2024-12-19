import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import { pricingPlans } from "@/config/pricingPlans";

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <PricingHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
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