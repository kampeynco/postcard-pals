import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "./types";

interface CommitteeNameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeNameField = ({ form }: CommitteeNameFieldProps) => {
  return (
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
  );
};