import { Check } from "lucide-react";

export const WithThanksColumn = () => {
  return (
    <div className="bg-green-50 p-8 rounded-lg">
      <h3 className="font-semibold mb-6 text-xl">Thank You with Thanks From Us</h3>
      <ul className="space-y-4">
        <ComparisonItem text="No supply runs" />
        <ComparisonItem text="No messing with mail merge" />
        <ComparisonItem text="No paper cuts" />
        <ComparisonItem text="No signing letters" />
        <ComparisonItem text="No stuffing envelopes" />
        <ComparisonItem text="No adding stamps" />
        <ComparisonItem text="No mail drop offs" />
        <ComparisonItem 
          icon={<span className="mr-2">⏰</span>} 
          text="10+ hours of time saved" 
          className="font-semibold text-green-700 mt-6"
        />
      </ul>
    </div>
  );
};

interface ComparisonItemProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

const ComparisonItem = ({ text, icon = <Check className="w-4 h-4 mr-2" />, className = "" }: ComparisonItemProps) => (
  <li className={`flex items-center text-green-600 ${className}`}>
    {icon}
    <span>{text}</span>
  </li>
);