import PublicNav from "@/components/navigation/PublicNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CallToAction } from "@/components/landing/CallToAction";
import { Footer } from "@/components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <HeroSection />
      <ComparisonSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;