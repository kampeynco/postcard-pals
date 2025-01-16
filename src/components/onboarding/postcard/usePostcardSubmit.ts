import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostcardData {
  frontColor: string;
  logoFile: File | null;
  logoAlignment: string;
  backMessage: string;
}

export const usePostcardSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPostcard = async (data: PostcardData) => {
    try {
      setIsSubmitting(true);
      
      let logoUrl = "";
      if (data.logoFile) {
        const fileExt = data.logoFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('postcard-images')
          .upload(filePath, data.logoFile);

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
          back_message: data.backMessage,
          template_data: {
            front_color: data.frontColor,
            logo_alignment: data.logoAlignment
          }
        });

      if (templateError) throw templateError;

      toast.success("Template saved successfully");
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPostcard, isSubmitting };
};