import { FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

interface DisclaimerSectionProps {
  form: UseFormReturn<FormValues>;
}

export const DisclaimerSection = ({ form }: DisclaimerSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="disclaimer_text"
      render={({ field }) => (
        <div className="space-y-2">
          <Label>Disclaimer Text</Label>
          <Textarea {...field} placeholder="Enter disclaimer text" />
        </div>
      )}
    />
  );
};