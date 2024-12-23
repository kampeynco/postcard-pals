import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../types";

interface CommitteeFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeFields = ({ form }: CommitteeFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="committee_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Committee Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter committee name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                <SelectItem value="non_profit">Non-Profit Organization</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};