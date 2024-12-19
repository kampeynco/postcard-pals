export const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            How Thanks From Us goes from
            <br />
            DONATION to THANK YOU CARD
          </h2>
        </div>

        {/* Steps Container */}
        <div className="max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Connect</h3>
            </div>
            <p className="text-gray-600 text-lg max-w-md mb-8">
              Connect your ActBlue account to automatically sync your donation data
            </p>
            {/* Wavy line connector with arrow */}
            <svg className="absolute left-1/2 -translate-x-1/2 top-full h-24 w-8 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 4 0 Q 8 32, 4 64 Q 0 96, 4 112"
                stroke="#4B5EE4"
                strokeWidth="2"
                fill="none"
              />
              {/* Arrow head */}
              <path
                d="M 0 112 L 4 120 L 8 112"
                fill="none"
                stroke="#4B5EE4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Process</h3>
            </div>
            <p className="text-gray-600 text-lg max-w-md mb-8">
              We automatically generate personalized thank you cards for each donation
            </p>
            {/* Wavy line connector with arrow */}
            <svg className="absolute left-1/2 -translate-x-1/2 top-full h-24 w-8 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 4 0 Q 8 32, 4 64 Q 0 96, 4 112"
                stroke="#4B5EE4"
                strokeWidth="2"
                fill="none"
              />
              {/* Arrow head */}
              <path
                d="M 0 112 L 4 120 L 8 112"
                fill="none"
                stroke="#4B5EE4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#FFD666] rounded-full flex items-center justify-center text-lg font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Deliver</h3>
            </div>
            <p className="text-gray-600 text-lg max-w-md">
              Cards are automatically printed and mailed to your donors within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};