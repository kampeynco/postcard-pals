import { XIcon } from "lucide-react";

export const WithoutThanksColumn = () => {
  return (
    <div className="bg-red-50 p-8 rounded-lg">
      <h3 className="font-semibold mb-6 text-xl">Thank You without Thanks From Us</h3>
      <ul className="space-y-4">
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="1-2 hr sorting mailing supplies" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="2 hrs merging with mail merge" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="4 hrs signing letters" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="30 min dealing with payments" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="3 hrs stuffing envelopes" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="1 hrs adding stamps" />
        <ComparisonItem icon={<XIcon className="w-4 h-4 text-red-600" />} text="20 min dropping off letters" />
        <ComparisonItem 
          icon={<span className="mr-2">⏰</span>} 
          text="10+ hours of headaches" 
          className="font-semibold text-red-700 mt-6"
        />
      </ul>
    </div>
  );
};

interface ComparisonItemProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const ComparisonItem = ({ icon, text, className = "" }: ComparisonItemProps) => (
  <li className={`flex items-center text-red-600 ${className}`}>
    {icon}
    <span>{text}</span>
  </li>
);