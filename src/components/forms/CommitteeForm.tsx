import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormValues, formSchema } from "./types";
import { CommitteeSection } from "./sections/CommitteeSection";
import { CandidateSection } from "./sections/CandidateSection";
import { AddressSection } from "./sections/AddressSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { toast } from "sonner";

interface CommitteeFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  submitLabel?: string;
}

export function CommitteeForm({ defaultValues, onSubmit, submitLabel = "Save" }: CommitteeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legal_committee_name: "",
      organization_name: "",
      committee_type: "candidate",
      candidate_first_name: "",
      candidate_middle_name: "",
      candidate_last_name: "",
      candidate_suffix: null,
      office_sought: undefined,
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      disclaimer_text: "",
      ...defaultValues,
    },
  });

  const committeeType = form.watch("committee_type");
  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save changes");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <CommitteeSection form={form} />
        {committeeType === "candidate" && <CandidateSection form={form} />}
        <AddressSection form={form} />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}