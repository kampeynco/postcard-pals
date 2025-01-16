import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FrontPostcardSection } from "./postcard/FrontPostcardSection";
import { BackPostcardSection } from "./postcard/BackPostcardSection";
import { usePostcardSubmit } from "./postcard/usePostcardSubmit";

interface PostcardStepProps {
  onNext: (data: {
    frontColor: string;
    logoFile: File | null;
    logoAlignment: string;
    backMessage: string;
  }) => void;
  onBack: () => void;
  defaultValues?: {
    front_color?: string;
    logo_alignment?: string;
    back_message?: string;
  };
}

export function PostcardStep({ onNext, onBack, defaultValues }: PostcardStepProps) {
  const [frontColor, setFrontColor] = useState(defaultValues?.front_color || "#ffffff");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoAlignment, setLogoAlignment] = useState(defaultValues?.logo_alignment || "center");
  const [backMessage, setBackMessage] = useState(defaultValues?.back_message || "");
  
  const handleSubmit = async () => {
      const data = { 
          frontColor, 
          logoFile, 
          logoAlignment, 
          backMessage 
      };
      await onNext(data);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Create Template</h2>
        <p className="text-gray-500 text-sm">Design your default thank you postcard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FrontPostcardSection
          frontColor={frontColor}
          setFrontColor={setFrontColor}
          handleLogoChange={handleLogoChange}
          logoAlignment={logoAlignment}
          setLogoAlignment={setLogoAlignment}
        />
        <BackPostcardSection
          backMessage={backMessage}
          setBackMessage={setBackMessage}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
        >
          Continue
        </Button>
      </div>
    </div>
  );
}