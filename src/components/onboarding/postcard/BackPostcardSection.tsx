import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BackPostcardSectionProps {
  backMessage: string;
  setBackMessage: (message: string) => void;
}

export function BackPostcardSection({ backMessage, setBackMessage }: BackPostcardSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Back of Postcard</h3>
        <div className="space-y-2">
          <Label htmlFor="backMessage">Default Message</Label>
          <Textarea
            id="backMessage"
            value={backMessage}
            onChange={(e) => setBackMessage(e.target.value)}
            placeholder="Enter your default thank you message..."
            className="h-[200px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}