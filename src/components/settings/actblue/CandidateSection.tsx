import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues, officeOptions } from "@/components/actblue/types";

interface CandidateSectionProps {
  form: UseFormReturn<FormValues>;
  show: boolean;
}

export const CandidateSection = ({ form, show }: CandidateSectionProps) => {
  if (!show) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="candidate_first_name"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Candidate First Name</Label>
            <Input {...field} placeholder="Enter first name" />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="candidate_last_name"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Candidate Last Name</Label>
            <Input {...field} placeholder="Enter last name" />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="office_sought"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Office Sought</Label>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <option value="">Select office</option>
              {officeOptions.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </Select>
          </div>
        )}
      />
    </div>
  );
};