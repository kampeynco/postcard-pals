import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "../types";

interface CandidateSectionProps {
  form: UseFormReturn<FormValues>;
}

export function CandidateSection({ form }: CandidateSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="candidate_first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="candidate_middle_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="candidate_last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="candidate_suffix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suffix (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select suffix" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                <SelectItem value="U.S. President">U.S. President</SelectItem>
                <SelectItem value="U.S. Senator">U.S. Senator</SelectItem>
                <SelectItem value="U.S. Representative">U.S. Representative</SelectItem>
                <SelectItem value="Governor">Governor</SelectItem>
                <SelectItem value="Lieutenant Governor">Lieutenant Governor</SelectItem>
                <SelectItem value="State Senator">State Senator</SelectItem>
                <SelectItem value="State Representative">State Representative</SelectItem>
                <SelectItem value="Attorney General">Attorney General</SelectItem>
                <SelectItem value="Secretary of State">Secretary of State</SelectItem>
                <SelectItem value="State Treasurer">State Treasurer</SelectItem>
                <SelectItem value="Mayor">Mayor</SelectItem>
                <SelectItem value="City Council Member">City Council Member</SelectItem>
                <SelectItem value="County Commissioner">County Commissioner</SelectItem>
                <SelectItem value="District Attorney">District Attorney</SelectItem>
                <SelectItem value="Sheriff">Sheriff</SelectItem>
                <SelectItem value="School Board Member">School Board Member</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}