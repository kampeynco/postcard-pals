import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormValues, officeOptions } from "@/types/actblue";

export const OfficeSoughtField = () => {
  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name="office_sought"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Office Sought</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
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
  );
};