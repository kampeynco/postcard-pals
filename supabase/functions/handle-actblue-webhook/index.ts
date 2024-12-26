import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Received ActBlue webhook:', payload)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log webhook
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue',
        payload,
        status: 'received'
      })

    if (logError) {
      console.error('Failed to log webhook:', logError)
      throw new Error(`Failed to log webhook: ${logError.message}`)
    }

    // Get user's timezone from ActBlue account settings
    const { data: actblueAccount, error: actblueError } = await supabase
      .from('actblue_accounts')
      .select('id')
      .eq('committee_name', payload.recipient.committee_name)
      .single()

    if (actblueError) {
      console.error('Failed to fetch ActBlue account:', actblueError)
      throw new Error(`Failed to fetch ActBlue account: ${actblueError.message}`)
    }

    // Calculate queue date based on current time in user's timezone
    const now = new Date()
    const queueDate = new Date(now.getTime())
    queueDate.setHours(0, 0, 0, 0) // Set to start of next day for processing

    // Process donation
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        donation_data: {
          donor_name: payload.donor.name,
          amount: payload.amount,
          email: payload.donor.email,
          address: payload.donor.address,
          committee_name: payload.recipient.committee_name
        },
        source: 'actblue',
        processed: false,
        postcard_sent: false,
        queue_status: 'pending_verification',
        queue_date: queueDate.toISOString(),
        timezone: 'America/New_York', // Default timezone, can be customized per user
        processing_attempts: 0,
        user_id: actblueAccount.id
      })
      .select()
      .single()

    if (donationError) {
      console.error('Failed to save donation:', donationError)
      throw new Error(`Failed to save donation: ${donationError.message}`)
    }

    console.log('Successfully processed donation:', donation)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: donation 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing ActBlue webhook:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})