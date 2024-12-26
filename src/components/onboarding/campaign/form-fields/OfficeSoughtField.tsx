import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues, officeOptions } from "../types";

interface OfficeSoughtFieldProps {
  form: UseFormReturn<FormValues>;
}

export const OfficeSoughtField = ({ form }: OfficeSoughtFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="office_sought"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Office Sought</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {officeOptions.map((office) => (
                <SelectItem key={office} value={office}>
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};