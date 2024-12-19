import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicNav from "@/components/navigation/PublicNav";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-[#4B5EE4] text-white relative">
        <PublicNav />
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

      {/* How It Works Section - ShipBob Style */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How Thanks From Us Works</h2>
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-20 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold z-10">
                1
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold mb-3 text-navy-900">Connect ActBlue</h3>
                <p className="text-gray-600 text-lg">
                  Link your ActBlue account to automatically sync your donations. It takes less than 5 minutes to get everything set up.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-20 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold z-10">
                2
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold mb-3 text-navy-900">Design Your Thank You Cards</h3>
                <p className="text-gray-600 text-lg">
                  Choose from our templates or create your own custom design. Add your personal touch to make your donors feel special.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold z-10">
                3
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold mb-3 text-navy-900">Automatic Sending</h3>
                <p className="text-gray-600 text-lg">
                  We handle everything else - from printing to mailing. Your donors receive beautiful thank you cards without any extra work from you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#4B5EE4] text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">Join the team</span>
          <h2 className="text-3xl font-bold mt-6 mb-8">Be apart of the Gratitude Movement</h2>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
            <Link to="/signup">Send Thank You Faster</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;