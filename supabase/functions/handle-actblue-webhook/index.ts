import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const processDonationData = (payload: any) => {
  if (!payload.contribution || !payload.donor) {
    throw new Error('Missing required fields in payload')
  }

  return {
    amount: payload.contribution?.amount || 0,
    donor_name: `${payload.donor?.firstname || ''} ${payload.donor?.lastname || ''}`.trim(),
    email: payload.donor?.email || '',
    address: {
      street: payload.donor?.addr1 || '',
      city: payload.donor?.city || '',
      state: payload.donor?.state || '',
      zip: payload.donor?.zip || ''
    },
    actblue_express_user_id: payload.donor?.actblue_express_user_id,
    actblue_contribution_id: payload.contribution?.contribution_id,
    timestamp: payload.contribution?.timestamp || new Date().toISOString()
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    console.log('Received webhook request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    })

    const payload = await req.json()
    console.log('Parsed webhook payload:', payload)

    const donationData = processDonationData(payload)
    console.log('Processed donation data:', donationData)

    const { data: donationResult, error: donationError } = await supabase
      .from('donations')
      .insert({
        donation_data: donationData,
        source: 'actblue',
        processed: false,
        postcard_sent: false
      })
      .select()
      .single()

    if (donationError) throw donationError

    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue_donation',
        payload,
        status: 'success'
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Donation processed successfully',
        donation_data: donationData 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)

    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue_donation',
        payload: await req.clone().json(),
        status: 'error',
        error_message: error.message
      })

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process donation webhook',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})