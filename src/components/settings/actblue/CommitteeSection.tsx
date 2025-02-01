import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/actblue/types";

interface CommitteeSectionProps {
  form: UseFormReturn<FormValues>;
}

export const CommitteeSection = ({ form }: CommitteeSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="legal_committee_name"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Legal Committee Name</Label>
            <Input {...field} placeholder="Enter legal committee name" />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="committee_type"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Committee Type</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <option value="candidate">Candidate Committee</option>
              <option value="political_action_committee">Political Action Committee</option>
              <option value="non_profit">Non-Profit</option>
            </Select>
          </div>
        )}
      />
    </div>
  );
};