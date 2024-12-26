import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues, committeeTypes } from "../types";

interface CommitteeTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeTypeField = ({ form }: CommitteeTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="committee_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Committee Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select committee type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {committeeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
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