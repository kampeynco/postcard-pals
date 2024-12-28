import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostcardStepProps {
  onNext: () => void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      let logoUrl = "";
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('postcard-images')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('postcard-images')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { error: templateError } = await supabase
        .from('default_templates')
        .upsert({
          user_id: session.user.id,
          front_image_url: logoUrl,
          back_message: backMessage,
          template_data: {
            front_color: frontColor,
            logo_alignment: logoAlignment
          }
        });

      if (templateError) throw templateError;

      toast.success("Template saved successfully");
      onNext();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Create Template</h2>
        <p className="text-gray-500 text-sm">Design your default thank you postcard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}