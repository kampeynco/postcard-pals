import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { FormValues } from "../types";
import type { AddressInput } from "@/components/address/types";
import { useActBlueAccountSubmit } from "./useActBlueAccountSubmit";
import { useAddressSubmit } from "./useAddressSubmit";
import { ActBlueFormData, Address } from "@/components/actblue/types/form";

export const useCampaignSubmit = (onNext: () => void) => {
  const { submitActBlueAccount } = useActBlueAccountSubmit();
  const { submitAddress } = useAddressSubmit();

  const convertToActBlueFormData = (values: FormValues, verifiedAddress: AddressInput): ActBlueFormData => {
    return {
      committee_type: values.committee_type,
      legal_committee_name: values.legal_committee_name,
      organization_name: values.organization_name,
      disclaimer_text: values.disclaimer_text,
      candidate_first_name: values.candidate_first_name,
      candidate_middle_name: values.candidate_middle_name,
      candidate_last_name: values.candidate_last_name,
      candidate_suffix: values.candidate_suffix,
      office_sought: values.office_sought,
      address: {
        street1: verifiedAddress.street,
        city: verifiedAddress.city,
        state: verifiedAddress.state,
        zip_code: verifiedAddress.zip_code
      } as Address
    };
  };

  const handleSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required");
      }

      if (!verifiedAddress) {
        throw new Error("Address verification required");
      }

      if (!values.committee_type || !values.legal_committee_name || !values.disclaimer_text) {
        throw new Error("Please fill in all required fields");
      }

      if (values.committee_type === 'candidate' && (!values.candidate_first_name || !values.candidate_last_name || !values.office_sought)) {
        throw new Error("Please fill in all candidate information");
      }

      const formData = convertToActBlueFormData(values, verifiedAddress);
      const actblueAccountId = await submitActBlueAccount(formData, user.id, verifiedAddress);
      await submitAddress(actblueAccountId, verifiedAddress);

      toast.success("Campaign details saved successfully");
      onNext();
    } catch (error) {
      console.error('Error in campaign details submission:', error);
      if (error instanceof Error) {
        toast.error(`Failed to save campaign details: ${error.message}`);
      } else {
        toast.error("Failed to save campaign details. Please try again.");
      }
      throw error;
    }
  };

  return { handleSubmit };
};