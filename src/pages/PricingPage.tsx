import PublicNav from "@/components/navigation/PublicNav";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="mt-2 text-gray-600">
              Our pricing details will be available shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
