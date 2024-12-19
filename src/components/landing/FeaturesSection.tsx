import { Card, CardContent } from "@/components/ui/card";
import { Users, MailCheck, LineChart, Sparkles } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#4B5EE4] text-sm font-medium uppercase tracking-wide">Features</span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900 tracking-tight">
            Powerful features to streamline your
            <br />
            donor thank you process
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ActBlue Integration */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-[#4B5EE4]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ActBlue Integration
              </h3>
              <p className="text-gray-600">
                Seamlessly connect with ActBlue to automatically capture and process donations. 
                No manual data entry required.
              </p>
            </CardContent>
          </Card>

          {/* Automated Thank Yous */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
                <MailCheck className="w-16 h-16 text-[#4B5EE4]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Automated Thank Yous
              </h3>
              <p className="text-gray-600">
                Choose from professionally designed templates and automatically send 
                personalized thank you postcards to your donors.
              </p>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
                <LineChart className="w-16 h-16 text-[#4B5EE4]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Track donation trends, monitor thank you card delivery status, and measure 
                the impact of your gratitude campaign.
              </p>
            </CardContent>
          </Card>

          {/* Smart Templates */}
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl p-8">
            <CardContent className="p-0">
              <div className="h-48 bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-[#4B5EE4]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Templates
              </h3>
              <p className="text-gray-600">
                Create and customize thank you card templates with dynamic fields that 
                automatically populate with donor information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};