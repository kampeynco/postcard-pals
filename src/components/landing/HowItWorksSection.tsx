export const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            How Thanks From Us goes from
            <br />
            Donation to Thank You Card
          </h2>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
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

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
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

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
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
  );
};