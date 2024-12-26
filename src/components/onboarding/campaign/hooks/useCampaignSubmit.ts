import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { FormValues } from "../types";
import type { AddressInput } from "@/components/address/types";
import { useActBlueAccountSubmit } from "./useActBlueAccountSubmit";
import { useAddressSubmit } from "./useAddressSubmit";

export const useCampaignSubmit = (onNext: () => void) => {
  const { submitActBlueAccount } = useActBlueAccountSubmit();
  const { submitAddress } = useAddressSubmit();

  const handleSubmit = async (values: FormValues, verifiedAddress: AddressInput | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required");
      }

      if (!verifiedAddress) {
        throw new Error("Address verification required");
      }

      // Data validation
      if (!values.committee_name || !values.committee_type || !values.disclaimer_text) {
        throw new Error("Please fill in all required fields");
      }

      if (values.committee_type === 'candidate' && (!values.candidate_name || !values.office_sought)) {
        throw new Error("Please fill in all candidate information");
      }

      const actblueAccountId = await submitActBlueAccount(values, user.id, verifiedAddress);
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