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
import { officeOptions } from "../types";

interface CandidateFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const CandidateFields = ({ form }: CandidateFieldsProps) => {
  return (
    <>
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
    </>
  );
};