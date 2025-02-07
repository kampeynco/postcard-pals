import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { PricingPlan } from "@/config/pricingPlans";

interface PricingCardProps {
  plan: PricingPlan;
  onGetStarted: () => void;
}

const PricingCard = ({ plan, onGetStarted }: PricingCardProps) => {
  return (
    <Card 
      className={`relative flex flex-col ${
        !plan.popular 
          ? 'border-[#4B5EE4] shadow-lg' 
          : 'border-orange-500 border-2 shadow-lg'
      } bg-white`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
          {plan.popular && (
            <span className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full">
              Most Popular
            </span>
          )}
        </div>
        <CardDescription className="text-gray-600">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={`${plan.name}-feature-${index}`} className="flex items-center gap-2">
              <Check className={`h-4 w-4 ${!plan.popular ? 'text-[#4B5EE4]' : 'text-orange-500'}`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${
            !plan.popular 
              ? 'bg-[#4B5EE4] hover:bg-[#4B5EE4]/90 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
          onClick={onGetStarted}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;