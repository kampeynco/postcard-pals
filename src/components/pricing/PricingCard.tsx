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
        plan.popular ? 'border-brand-accent shadow-lg' : 'border-white/10'
      } bg-white`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-brand-accent text-white text-sm font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
        <CardDescription className="text-gray-600">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brand-accent" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${
            plan.popular 
              ? 'bg-brand-accent hover:bg-brand-accent/90 text-white' 
              : 'bg-[#4B5EE4] hover:bg-[#4B5EE4]/90 text-white'
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