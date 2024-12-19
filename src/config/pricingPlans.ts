export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
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