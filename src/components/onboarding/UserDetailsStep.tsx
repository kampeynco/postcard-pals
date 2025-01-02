import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserDetails } from "./UserDetails";
import { useOnboarding } from "./hooks/useOnboarding";

interface UserDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const UserDetailsStep = ({ onNext, onBack }: UserDetailsStepProps) => {
  const { form } = useOnboarding();

  const handleSubmit = async (data: any) => {
    await form.trigger();
    if (form.formState.isValid) {
      await onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">User Details</h2>
      <p className="text-sm text-gray-600">Please provide your details to proceed.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <UserDetails />
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};