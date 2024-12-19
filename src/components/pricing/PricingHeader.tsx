const PricingHeader = () => {
  return (
    <div className="bg-[#4B5EE4] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">
            Simple pricing
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-6 mb-4">
            Choose the plan that works for you
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            All plans include unlimited users and our core features. 
            Upgrade or downgrade at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingHeader;