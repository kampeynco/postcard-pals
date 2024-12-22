import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface CandidateFieldsProps {
  form: UseFormReturn<FormValues>;
}

const POLITICAL_OFFICES = [
  { value: "president", label: "President of the United States" },
  { value: "us_senate", label: "U.S. Senator" },
  { value: "us_house", label: "U.S. Representative" },
  { value: "governor", label: "State Governor" },
  { value: "lt_governor", label: "Lieutenant Governor" },
  { value: "state_senate", label: "State Senator" },
  { value: "state_house", label: "State Representative" },
  { value: "attorney_general", label: "State Attorney General" },
  { value: "secretary_state", label: "Secretary of State" },
  { value: "state_treasurer", label: "State Treasurer" },
  { value: "mayor", label: "Mayor" },
  { value: "city_council", label: "City Council Member" },
  { value: "county_commissioner", label: "County Commissioner" },
  { value: "district_attorney", label: "District Attorney" },
  { value: "school_board", label: "School Board Member" }
];

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
                  <SelectValue placeholder="Select office sought" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {POLITICAL_OFFICES.map((office) => (
                  <SelectItem key={office.value} value={office.value}>
                    {office.label}
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