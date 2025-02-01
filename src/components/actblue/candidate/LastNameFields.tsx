import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormValues, SuffixType } from "../types";

const suffixOptions: SuffixType[] = [
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "V"
];

export const LastNameFields = () => {
  const form = useFormContext<FormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="candidate_last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter last name" 
                {...field} 
                autoComplete="family-name"
              />
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
            <FormLabel>Suffix</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a suffix" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {suffixOptions.map((suffix) => (
                  <SelectItem key={suffix} value={suffix}>
                    {suffix}
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