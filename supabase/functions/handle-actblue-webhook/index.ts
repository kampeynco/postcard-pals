import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process the donation data from ActBlue payload
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

// Store donation in Supabase
const storeDonation = async (supabase: any, donationData: any) => {
  const { data, error } = await supabase
    .from('donations')
    .insert({
      donation_data: donationData,
      source: 'actblue',
      processed: false,
      postcard_sent: false
    })

  if (error) {
    console.error('Error storing donation:', error)
    throw error
  }

  return data
}

// Log webhook activity
const logWebhookActivity = async (supabase: any, payload: any, status: string, errorMessage?: string) => {
  const { error } = await supabase
    .from('webhook_logs')
    .insert({
      webhook_type: 'actblue_donation',
      payload: payload,
      status: status,
      error_message: errorMessage
    })

  if (error) {
    console.error('Error logging webhook:', error)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const donationResult = await storeDonation(supabase, donationData)
    console.log('Successfully stored donation:', donationResult)

    await logWebhookActivity(supabase, payload, 'success')

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
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)

    await logWebhookActivity(supabase, await req.clone().json(), 'error', error.message)

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