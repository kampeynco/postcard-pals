import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActBlueSettings } from "./actblue/useActBlueSettings";
import { CommitteeSection } from "./actblue/CommitteeSection";
import { CandidateSection } from "./actblue/CandidateSection";
import { AddressSection } from "./actblue/AddressSection";
import { DisclaimerSection } from "./actblue/DisclaimerSection";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ActBlueSettingsForm() {
  const { form, onSubmit } = useActBlueSettings();
  const isCandidate = form.watch("committee_type") === "candidate";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <CommitteeSection form={form} />
            <CandidateSection form={form} show={isCandidate} />
            <AddressSection form={form} />
            <DisclaimerSection form={form} />
          </div>
        </Card>

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}