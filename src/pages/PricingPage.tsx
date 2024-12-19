import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import PublicNav from "@/components/navigation/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Starter",
      price: 49,
      description: "Perfect for getting started with thank you postcards",
      features: [
        "$1.79 per mailing",
        "1 ActBlue account",
        "Unlimited Users",
      ],
    },
    {
      name: "Grow",
      price: 99,
      description: "Ideal for growing campaigns and organizations",
      features: [
        "$1.29 per mailing",
        "5 ActBlue accounts",
        "Unlimited Users",
      ],
      popular: true,
    },
    {
      name: "Scale",
      price: 199,
      description: "For established organizations with high volume",
      features: [
        "$0.79 per mailing",
        "Unlimited ActBlue accounts",
        "Unlimited Users",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="bg-[#4B5EE4] text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Choose the plan that best fits your campaign
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
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
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default PricingPage;