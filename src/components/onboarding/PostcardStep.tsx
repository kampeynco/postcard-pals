import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PostcardStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PostcardStep({ onNext, onBack }: PostcardStepProps) {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backMessage, setBackMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontImage(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Design Your Default Postcard</h2>
        <p className="text-sm text-gray-600">
          Create your default thank you postcard design. You can always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front of postcard */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="frontImage">Front of Postcard (4.25" × 6")</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input
                id="frontImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {frontImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(frontImage)}
                    alt="Postcard front preview"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back of postcard */}
        <Card>
          <CardContent className="p-4">
            <Label htmlFor="backMessage">Back of Postcard</Label>
            <div className="mt-2">
              <Textarea
                id="backMessage"
                placeholder="Enter your default thank you message..."
                value={backMessage}
                onChange={(e) => setBackMessage(e.target.value)}
                className="h-[200px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}