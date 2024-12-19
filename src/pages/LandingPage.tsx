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

      {/* Features Comparison Section */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tired of manually<br />Thanking donors?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-xl">
              <h3 className="font-semibold mb-6">Thank You without Thanks From Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-2 text-red-600">
                  <span className="text-lg">×</span>
                  <span>1-2 hour mailing supplies</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <span className="text-lg">×</span>
                  <span>2 hrs merging with mail merge</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <span className="text-lg">×</span>
                  <span>4 hrs signing letters</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <span className="text-lg">×</span>
                  <span>30 min dealing with payments</span>
                </li>
                <li className="flex items-start gap-2 text-red-600">
                  <span className="text-lg">×</span>
                  <span>3 hrs stuffing envelopes</span>
                </li>
                <li className="flex items-start gap-2 text-red-600 font-semibold">
                  <span className="text-lg">×</span>
                  <span>10+ hours of headaches</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="font-semibold mb-6">Thank You with Thanks From Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>No supply runs</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>No merging with mail merge</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>No paper cuts</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>No signing letters</span>
                </li>
                <li className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>No stuffing envelopes</span>
                </li>
                <li className="flex items-center gap-2 text-green-600 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>10+ hours of time saved</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Updated Design */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Here's How It Works</h2>
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[28px] top-[60px] bottom-[60px] w-0.5 bg-blue-200 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-16 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold">
                1
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold mb-2">Connect ActBlue</h3>
                <p className="text-gray-600">
                  Link your ActBlue account to automatically sync your donations. It takes less than 5 minutes to get everything set up.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-16 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold">
                2
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold mb-2">Design Your Thank You Cards</h3>
                <p className="text-gray-600">
                  Choose from our templates or create your own custom design. Add your personal touch to make your donors feel special.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8 relative">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#4B5EE4] text-white flex items-center justify-center text-xl font-semibold">
                3
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-semibold mb-2">Automatic Sending</h3>
                <p className="text-gray-600">
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
