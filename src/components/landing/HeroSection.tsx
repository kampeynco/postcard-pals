import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="bg-[#4B5EE4] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <span className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">Powered by ActBlue</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 mb-6">
          Thank donors in days,<br />not weeks
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Streamline your thank-yous, focus on what matters.<br />
          We'll handle the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto" asChild>
            <Link to="/signup">Send Thank You Faster →</Link>
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Check className="text-green-400 w-5 h-5" />
            <span className="text-white/90">5-minute no-hassle setup</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="text-green-400 w-5 h-5" />
            <span className="text-white/90">Increase donor retention</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="text-green-400 w-5 h-5" />
            <span className="text-white/90">No more mail merges</span>
          </div>
        </div>
      </div>
    </div>
  );
};