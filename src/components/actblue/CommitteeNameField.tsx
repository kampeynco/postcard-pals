import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "./types";

interface CommitteeNameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeNameField = ({ form }: CommitteeNameFieldProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="legal_committee_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Legal Committee Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter legal committee name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="organization_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
            <FormControl>
              <Input placeholder="If different from Legal Committee Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};