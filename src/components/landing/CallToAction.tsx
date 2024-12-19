import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <div className="bg-[#4B5EE4] text-white py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">Join the team</span>
        <h2 className="text-3xl font-bold mt-6 mb-8">Be apart of the Gratitude Movement</h2>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
          <Link to="/signup">Send Thank You Faster</Link>
        </Button>
      </div>
    </div>
  );
};