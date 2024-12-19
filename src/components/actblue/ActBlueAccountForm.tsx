import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ActBlueAccount = Database["public"]["Tables"]["actblue_accounts"]["Insert"];

const formSchema = z.object({
  committee_name: z.string().min(2, "Committee name must be at least 2 characters"),
  committee_type: z.enum(["candidate", "political_action_committee", "non_profit"]),
  candidate_name: z.string().optional(),
  office_sought: z.string().optional(),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Please use 2-letter state code"),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  disclaimer_text: z.string().min(1, "Disclaimer text is required"),
}).refine(
  (data) => {
    if (data.committee_type === "candidate") {
      return !!data.candidate_name && !!data.office_sought;
    }
    return true;
  },
  {
    message: "Candidate name and office sought are required for candidate committees",
    path: ["candidate_name"],
  }
);

type FormValues = z.infer<typeof formSchema>;

export default function ActBlueAccountForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      committee_type: "candidate",
      candidate_name: "",
      office_sought: "",
      committee_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
    },
  });

  const committeeType = form.watch("committee_type");

  async function onSubmit(values: FormValues) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const insertData: ActBlueAccount = {
        ...values,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("actblue_accounts")
        .insert(insertData);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "ActBlue account settings saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save ActBlue account settings. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <SelectItem value="candidate">Candidate Committee</SelectItem>
                  <SelectItem value="political_action_committee">Political Action Committee</SelectItem>
                  <SelectItem value="non_profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {committeeType === "candidate" && (
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
        )}

        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="CA" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="disclaimer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disclaimer Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter disclaimer text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save ActBlue Settings</Button>
      </form>
    </Form>
  );
}