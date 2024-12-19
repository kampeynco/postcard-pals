import { Card } from "@/components/ui/card";
import { ClipboardCheck, Send, ThumbsUp } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            How Thanks From Us goes from
            <br />
            donation to thank you card
          </h2>
        </div>

        {/* Steps Container */}
        <div className="max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-12 relative">
            <div className="w-1/2">
              <Card className="p-6 bg-white shadow-lg relative rounded-xl">
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#FFD666] rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="h-36 bg-[#4B5EE4]/10 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-16 h-16 text-[#4B5EE4]" />
                </div>
              </Card>
              {/* Dotted line connector */}
              <div className="absolute left-1/2 top-full h-16 border-l-2 border-dashed border-gray-300"></div>
            </div>
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 text-lg">
                Connect your ActBlue account to automatically sync your donation data
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-12 relative mt-16">
            <div className="w-1/2">
              <Card className="p-6 bg-white shadow-lg relative rounded-xl">
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#FFD666] rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="h-36 bg-[#4B5EE4]/10 rounded-lg flex items-center justify-center mb-4">
                  <Send className="w-16 h-16 text-[#4B5EE4]" />
                </div>
              </Card>
              {/* Dotted line connector */}
              <div className="absolute left-1/2 top-full h-16 border-l-2 border-dashed border-gray-300"></div>
            </div>
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Process</h3>
              <p className="text-gray-600 text-lg">
                We automatically generate personalized thank you cards for each donation
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-12 mt-16">
            <div className="w-1/2">
              <Card className="p-6 bg-white shadow-lg relative rounded-xl">
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-[#FFD666] rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="h-36 bg-[#4B5EE4]/10 rounded-lg flex items-center justify-center mb-4">
                  <ThumbsUp className="w-16 h-16 text-[#4B5EE4]" />
                </div>
              </Card>
            </div>
            <div className="w-1/2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deliver</h3>
              <p className="text-gray-600 text-lg">
                Cards are automatically printed and mailed to your donors within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};