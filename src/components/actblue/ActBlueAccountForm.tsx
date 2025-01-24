import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommitteeTypeField } from "./CommitteeTypeField";
import { CommitteeNameField } from "./CommitteeNameField";
import { CandidateFields } from "./CandidateFields";
import { AddressFields } from "./AddressFields";
import { DisclaimerField } from "./DisclaimerField";
import { useActBlueForm } from "./useActBlueForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ActBlueAccountFormProps {
  onSuccess?: () => void;
}

export default function ActBlueAccountForm({ onSuccess }: ActBlueAccountFormProps) {
  const { form, committeeType, onSubmit, isLoading } = useActBlueForm({
    onSuccess,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <CommitteeTypeField form={form} />
          <CommitteeNameField form={form} />
          {committeeType === "candidate" && <CandidateFields />}
          <AddressFields form={form} />
          <DisclaimerField form={form} />
        </div>
        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save ActBlue Settings'
          )}
        </Button>
      </form>
    </Form>
  );
}