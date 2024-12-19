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
              <div className="relative">
                <div className="h-32 w-32 bg-[#4B5EE4]/10 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="w-16 h-16 text-[#4B5EE4]" />
                </div>
                {/* Wavy line connector */}
                <svg className="absolute left-1/2 top-full h-16 w-8 overflow-visible" preserveAspectRatio="none">
                  <path
                    d="M 4 0 Q 8 16, 4 32 Q 0 48, 4 64"
                    stroke="#4B5EE4"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Connect</h3>
              </div>
              <p className="text-gray-600 text-lg">
                Connect your ActBlue account to automatically sync your donation data
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-12 relative mt-16">
            <div className="w-1/2">
              <div className="relative">
                <div className="h-32 w-32 bg-[#4B5EE4]/10 rounded-full flex items-center justify-center">
                  <Send className="w-16 h-16 text-[#4B5EE4]" />
                </div>
                {/* Wavy line connector */}
                <svg className="absolute left-1/2 top-full h-16 w-8 overflow-visible" preserveAspectRatio="none">
                  <path
                    d="M 4 0 Q 8 16, 4 32 Q 0 48, 4 64"
                    stroke="#4B5EE4"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Process</h3>
              </div>
              <p className="text-gray-600 text-lg">
                We automatically generate personalized thank you cards for each donation
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-12 mt-16">
            <div className="w-1/2">
              <div className="relative">
                <div className="h-32 w-32 bg-[#4B5EE4]/10 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-16 h-16 text-[#4B5EE4]" />
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Deliver</h3>
              </div>
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