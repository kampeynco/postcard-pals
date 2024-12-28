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

export const createPostcard = async (donation: any, template: any) => {
  const response = await fetch('https://api.lob.com/v1/postcards', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(Deno.env.get('LOB_API_KEY') + ':')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: `Thank you postcard for donation ${donation.id}`,
      to: donation.donation_data.donor.address,
      from: {
        name: donation.actblue_accounts.committee_name,
        address_line1: donation.actblue_accounts.street_address,
        address_city: donation.actblue_accounts.city,
        address_state: donation.actblue_accounts.state,
        address_zip: donation.actblue_accounts.zip_code
      },
      front: template.front_image_url,
      back: template.back_message,
      size: '4x6'
    }),
  });

  return await response.json();
};

export const savePostcardRecord = async (supabase: any, data: any) => {
  return await supabase
    .from('postcards')
    .insert({
      user_id: data.userId,
      donation_id: data.donationId,
      template_id: data.templateId,
      lob_id: data.lobId,
      status: 'pending',
      expected_delivery_date: data.expectedDeliveryDate
    });
};

export const updateDonationStatus = async (supabase: any, donation: any, status: string, error?: string) => {
  const updateData = {
    queue_status: status,
    postcard_sent: status === 'processing_complete',
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