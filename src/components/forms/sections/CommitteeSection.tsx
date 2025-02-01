import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "../types";

interface CommitteeSectionProps {
  form: UseFormReturn<FormValues>;
}

export function CommitteeSection({ form }: CommitteeSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="committee_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Committee Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
            <FormLabel>Organization Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="If different from Legal Committee Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="disclaimer_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disclaimer Text</FormLabel>
            <FormControl>
              <Input placeholder="Paid for by..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}