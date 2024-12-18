import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Received ActBlue webhook payload:', payload)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract relevant data from ActBlue payload
    const donationData = {
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

    // Store donation in database
    const { data, error } = await supabase
      .from('donations')
      .insert({
        donation_data: donationData,
        user_id: payload.metadata?.user_id, // Assuming ActBlue webhook includes user_id in metadata
        processed: false,
        postcard_sent: false
      })

    if (error) {
      console.error('Error storing donation:', error)
      throw error
    }

    console.log('Successfully stored donation:', data)

    // Log webhook receipt in webhook_logs table
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue_donation',
        payload: payload,
        status: 'success'
      })

    return new Response(
      JSON.stringify({ success: true, message: 'Donation processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)

    // Log error in webhook_logs table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue_donation',
        payload: await req.json(),
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})