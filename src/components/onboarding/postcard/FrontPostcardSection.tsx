import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FrontPostcardSectionProps {
  frontColor: string;
  setFrontColor: (color: string) => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoAlignment: string;
  setLogoAlignment: (alignment: string) => void;
}

export function FrontPostcardSection({
  frontColor,
  setFrontColor,
  handleLogoChange,
  logoAlignment,
  setLogoAlignment
}: FrontPostcardSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Front of Postcard</h3>
        
        <div className="space-y-2">
          <Label htmlFor="frontColor">Background Color</Label>
          <Input
            id="frontColor"
            type="color"
            value={frontColor}
            onChange={(e) => setFrontColor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Upload Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Logo Alignment</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cover Front: Logo fills the entire front of the postcard</p>
                  <p>Center Align: Places your logo in the center, maintaining proportions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={logoAlignment} onValueChange={setLogoAlignment}>
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover Front</SelectItem>
              <SelectItem value="center">Center Align</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}