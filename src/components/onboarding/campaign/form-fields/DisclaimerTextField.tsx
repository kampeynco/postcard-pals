import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface DisclaimerTextFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DisclaimerTextField = ({ form }: DisclaimerTextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="disclaimer_text"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Disclaimer Text</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter disclaimer text"
              className="min-h-[100px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};