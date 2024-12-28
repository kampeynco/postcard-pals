import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePostcardSubmit = (onNext: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    logoFile: File | null,
    frontColor: string,
    logoAlignment: string,
    backMessage: string
  ) => {
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

  return { handleSubmit, isSubmitting };
};