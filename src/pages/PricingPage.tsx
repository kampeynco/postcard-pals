import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const plans = [
    {
      name: "Starter",
      price: 49,
      perMailing: 1.79,
      actBlueAccounts: 1,
      features: ["Unlimited Users", "Basic Templates", "Email Support"],
    },
    {
      name: "Grow",
      price: 99,
      perMailing: 1.29,
      actBlueAccounts: 5,
      features: ["Everything in Starter", "Priority Support", "Custom Templates"],
      popular: true,
    },
    {
      name: "Scale",
      price: 199,
      perMailing: 0.79,
      actBlueAccounts: "Unlimited",
      features: ["Everything in Grow", "Dedicated Support", "API Access"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for your campaign</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-emerald-500 text-white text-center py-1 text-sm">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="mb-6 text-gray-600">
                  <p>${plan.perMailing} per mailing</p>
                  <p>
                    {typeof plan.actBlueAccounts === "number"
                      ? `${plan.actBlueAccounts} ActBlue ${
                          plan.actBlueAccounts === 1 ? "Account" : "Accounts"
                        }`
                      : "Unlimited ActBlue Accounts"}
                  </p>
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-emerald-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
