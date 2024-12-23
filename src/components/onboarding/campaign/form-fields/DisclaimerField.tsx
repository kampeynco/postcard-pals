import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../types";

interface DisclaimerFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DisclaimerField = ({ form }: DisclaimerFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="disclaimer_text"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Legal Disclaimer</FormLabel>
          <FormControl>
            <Input placeholder="Paid for by..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};