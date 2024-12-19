export const ComparisonSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tired of manually Thanking donors?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Thanks From Us */}
          <div className="bg-red-50 p-8 rounded-lg">
            <h3 className="font-semibold mb-6 text-xl">Thank You without Thanks From Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>1-2 hr sorting mailing supplies</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>2 hrs merging with mail merge</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>4 hrs signing letters</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>30 min dealing with payments</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>3 hrs stuffing envelopes</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>1 hrs adding stamps</span>
              </li>
              <li className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>20 min dropping off letters</span>
              </li>
              <li className="flex items-center font-semibold text-red-700 mt-6">
                <span className="mr-2">⏰</span>
                <span>10+ hours of headaches</span>
              </li>
            </ul>
          </div>

          {/* With Thanks From Us */}
          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="font-semibold mb-6 text-xl">Thank You with Thanks From Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No supply runs</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No messing with mail merge</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No paper cuts</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No signing letters</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No stuffing envelopes</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No adding stamps</span>
              </li>
              <li className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>No mail drop offs</span>
              </li>
              <li className="flex items-center font-semibold text-green-700 mt-6">
                <span className="mr-2">⏰</span>
                <span>10+ hours of time saved</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};