import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues, officeOptions, committeeTypes } from "./types";

interface CampaignFormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const CampaignFormFields = ({ form }: CampaignFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="committee_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Committee Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter committee name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="committee_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Committee Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select committee type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {committeeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="candidate_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Candidate Name (Optional)</FormLabel>
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
            <FormLabel>Office Sought (Optional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select office" />
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

      <FormField
        control={form.control}
        name="disclaimer_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disclaimer Text</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter disclaimer text"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};