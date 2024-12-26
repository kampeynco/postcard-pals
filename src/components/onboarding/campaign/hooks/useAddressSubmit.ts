import { supabase } from "@/integrations/supabase/client";
import type { AddressInput } from "@/components/address/types";

export const useAddressSubmit = () => {
  const submitAddress = async (actblueAccountId: string, verifiedAddress: AddressInput) => {
    const { error: addressError } = await supabase
      .from("addresses")
      .upsert({
        actblue_account_id: actblueAccountId,
        lob_id: 'manual_verification',
        address_data: {
          street: verifiedAddress.street,
          city: verifiedAddress.city,
          state: verifiedAddress.state,
          zip_code: verifiedAddress.zip_code
        },
        is_verified: true,
        last_verified_at: new Date().toISOString()
      }, {
        onConflict: 'actblue_account_id'
      });

    if (addressError) throw addressError;
  };

  return { submitAddress };
};