import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { CommitteeNameField } from "./form-fields/CommitteeNameField";
import { CommitteeTypeField } from "./form-fields/CommitteeTypeField";
import { CandidateNameField } from "./form-fields/CandidateNameField";
import { OfficeSoughtField } from "./form-fields/OfficeSoughtField";
import { DisclaimerTextField } from "./form-fields/DisclaimerTextField";
import { AddressForm } from "@/components/address/AddressForm";
import { FormField, FormItem } from "@/components/ui/form";

interface CampaignFormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const CampaignFormFields = ({ form }: CampaignFormFieldsProps) => {
  const committeeType = form.watch("committee_type");
  
  return (
    <div className="space-y-6">
      <CommitteeNameField form={form} />
      <CommitteeTypeField form={form} />
      {committeeType === "candidate" && (
        <>
          <CandidateNameField form={form} />
          <OfficeSoughtField form={form} />
        </>
      )}
      <DisclaimerTextField form={form} />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <AddressForm
              address={field.value || {
                street: "",
                city: "",
                state: "",
                zip_code: ""
              }}
              onChange={field.onChange}
            />
          </FormItem>
        )}
      />
    </div>
  );
};