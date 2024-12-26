import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface CandidateNameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const CandidateNameField = ({ form }: CandidateNameFieldProps) => {
  return (
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
  );
};