import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import { pricingPlans } from "@/config/pricingPlans";

const PricingPage = () => {
  return (
    <div>
      <PublicNav />
      <PricingHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;