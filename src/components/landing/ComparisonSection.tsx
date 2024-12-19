import { WithoutThanksColumn } from "./comparison/WithoutThanksColumn";
import { WithThanksColumn } from "./comparison/WithThanksColumn";

export const ComparisonSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tired of manually Thanking donors?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <WithoutThanksColumn />
          <WithThanksColumn />
        </div>
      </div>
    </div>
  );
};