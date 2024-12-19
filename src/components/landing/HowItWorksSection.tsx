export const HowItWorksSection = () => {
  return (
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
  );
};