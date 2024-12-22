import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormValues, OfficeType } from "./types";

const officeOptions: OfficeType[] = [
  // Federal Offices
  "U.S. President",
  "U.S. Senator",
  "U.S. Representative",
  // State Offices
  "Governor",
  "Lieutenant Governor",
  "State Senator",
  "State Representative",
  "Attorney General",
  "Secretary of State",
  "State Treasurer",
  // Local Offices
  "Mayor",
  "City Council Member",
  "County Commissioner",
  "District Attorney",
  "Sheriff",
  "School Board Member"
];

export const CandidateFields = () => {
  const form = useFormContext<FormValues>();
  const showFields = form.watch("committee_type") === "candidate";

  if (!showFields) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="candidate_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Candidate Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter candidate name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="office_sought"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Office Sought</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an office" />
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
    </div>
  );
};