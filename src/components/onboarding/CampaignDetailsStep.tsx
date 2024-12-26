import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCampaignForm } from "./campaign/hooks/useCampaignForm";
import { CampaignFormFields } from "./campaign/CampaignFormFields";

interface CampaignDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const CampaignDetailsStep = ({ onNext, onBack }: CampaignDetailsStepProps) => {
  const { form, onSubmit } = useCampaignForm(onNext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Campaign Details</h2>
        <p className="text-gray-500 text-sm">Tell us about your campaign</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CampaignFormFields form={form} />
          
          <Button 
            type="submit" 
            className="w-full bg-brand-background hover:bg-brand-background/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Back to previous step
        </button>
      </div>
    </div>
  );
};