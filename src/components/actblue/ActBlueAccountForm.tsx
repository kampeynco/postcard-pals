import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommitteeTypeField } from "./CommitteeTypeField";
import { CommitteeNameField } from "./CommitteeNameField";
import { CandidateFields } from "./CandidateFields";
import { AddressFields } from "./AddressFields";
import { DisclaimerField } from "./DisclaimerField";
import { useActBlueForm } from "./useActBlueForm";

interface ActBlueAccountFormProps {
  onSuccess?: () => void;
}

export default function ActBlueAccountForm({ onSuccess }: ActBlueAccountFormProps) {
  const { form, committeeType, onSubmit } = useActBlueForm({
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommitteeTypeField form={form} />
        <CommitteeNameField form={form} />
        {committeeType === "candidate" && <CandidateFields />}
        <AddressFields form={form} />
        <DisclaimerField form={form} />
        <Button type="submit">Save ActBlue Settings</Button>
      </form>
    </Form>
  );
}