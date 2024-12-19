import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const HeroSection = () => {
  return (
    <div className="bg-[#4B5EE4] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <span className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">Powered by ActBlue</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 mb-6">
          Thank donors in days,<br />not weeks
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Streamline your thank-yous, focus on what matters.<br />
          We'll handle the rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto" asChild>
            <Link to="/signup">Send Thank You Faster →</Link>
          </Button>
        </div>
        <div className="flex justify-center mb-12">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2 text-left">
              <Check className="text-green-400 w-5 h-5 flex-shrink-0" />
              <span className="text-white/90">5-minute no-hassle setup</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <Check className="text-green-400 w-5 h-5 flex-shrink-0" />
              <span className="text-white/90">Increase donor retention</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <Check className="text-green-400 w-5 h-5 flex-shrink-0" />
              <span className="text-white/90">No more mail merges</span>
            </div>
          </div>
        </div>
        
        {/* Validation Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          {/* Avatar Stack */}
          <div className="flex -space-x-3">
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/100?img=1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/100?img=2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/100?img=3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/100?img=4" />
              <AvatarFallback>U4</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/100?img=5" />
              <AvatarFallback>U5</AvatarFallback>
            </Avatar>
          </div>
          {/* Rating and Text Column */}
          <div className="flex flex-col items-center md:items-start">
            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            {/* Text */}
            <p className="text-sm text-white/90">
              <span className="font-semibold">135+ leaders</span> send thank yous faster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};