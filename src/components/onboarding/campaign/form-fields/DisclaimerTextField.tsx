import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
            <Input 
              placeholder="Paid for by..."
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};