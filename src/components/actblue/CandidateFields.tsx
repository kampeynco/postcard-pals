import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

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
            <FormControl>
              <Input placeholder="Enter office sought" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};