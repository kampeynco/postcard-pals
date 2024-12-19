import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

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
              <SelectItem value="candidate">Candidate Committee</SelectItem>
              <SelectItem value="political_action_committee">Political Action Committee</SelectItem>
              <SelectItem value="non_profit">Non-Profit</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};