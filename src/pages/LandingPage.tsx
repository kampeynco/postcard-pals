import PublicNav from "@/components/navigation/PublicNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CallToAction } from "@/components/landing/CallToAction";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <HeroSection />
      <ComparisonSection />
      <HowItWorksSection />
      <CallToAction />
    </div>
  );
};

export default LandingPage;