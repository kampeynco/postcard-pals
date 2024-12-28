import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

export const verifyAddress = async (address: any) => {
  const verificationResponse = await fetch('https://api.lob.com/v1/us_verifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(Deno.env.get('LOB_API_KEY') + ':')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      primary_line: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    }),
  });

  return await verificationResponse.json();
};

export const updateDonationStatus = async (supabase: any, donation: any, status: string, error?: string) => {
  const updateData = {
    queue_status: status,
    processing_attempts: donation.processing_attempts + 1,
    last_attempt_at: new Date().toISOString(),
  };

  if (error) {
    updateData.error_message = error;
  }

  return await supabase
    .from('donations')
    .update(updateData)
    .eq('id', donation.id);
};