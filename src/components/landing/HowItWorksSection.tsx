import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Send, ThumbsUp } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#4B5EE4] text-sm font-medium uppercase tracking-wide">How It Works</span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900 tracking-tight">
            Simple steps to automate your
            <br />
            donor thank you process
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1: Connect ActBlue */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-[#4B5EE4] rounded-full mb-6 flex items-center justify-center mx-auto">
                <ClipboardCheck className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="text-[#4B5EE4] font-semibold mb-2 block">Step 1</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Connect ActBlue
                </h3>
                <p className="text-gray-600">
                  Link your ActBlue account to automatically sync your donation data
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Choose Template */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-[#4B5EE4] rounded-full mb-6 flex items-center justify-center mx-auto">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="text-[#4B5EE4] font-semibold mb-2 block">Step 2</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Choose Template
                </h3>
                <p className="text-gray-600">
                  Select from our professionally designed thank you card templates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Customize Message */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-[#4B5EE4] rounded-full mb-6 flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="text-[#4B5EE4] font-semibold mb-2 block">Step 3</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Customize Message
                </h3>
                <p className="text-gray-600">
                  Personalize your message with dynamic donor information
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Automated Delivery */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-[#4B5EE4] rounded-full mb-6 flex items-center justify-center mx-auto">
                <ThumbsUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="text-[#4B5EE4] font-semibold mb-2 block">Step 4</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Automated Delivery
                </h3>
                <p className="text-gray-600">
                  Cards are automatically printed and mailed to your donors
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};